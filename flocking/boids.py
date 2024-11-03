import pygame
import random
import math

# Pygame setup
pygame.init()
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
clock = pygame.time.Clock()
black = (0, 0, 0)
white = (255, 255, 255)
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)

# Boid class
class Boid:
    def __init__(self):
        self.position = [random.uniform(0, width), random.uniform(0, height)]
        self.velocity = [random.uniform(-1, 1), random.uniform(-1, 1)]
        self.acceleration = [0, 0]

    def update(self, boids):
        alignment = [0, 0]
        cohesion = [0, 0]
        separation = [0, 0]
        perception_radius = 100

        for boid in boids:
            if boid != self:
                # Alignment
                alignment[0] += boid.velocity[0]
                alignment[1] += boid.velocity[1]

                # Cohesion
                dx = boid.position[0] - self.position[0]
                dy = boid.position[1] - self.position[1]
                distance = math.sqrt(dx ** 2 + dy ** 2)
                if distance < perception_radius:
                    cohesion[0] += boid.position[0]
                    cohesion[1] += boid.position[1]

                # Separation
                if distance < 50:
                    separation[0] -= dx
                    separation[1] -= dy

        alignment = [alignment[0] / len(boids), alignment[1] / len(boids)]
        cohesion = [cohesion[0] / len(boids), cohesion[1] / len(boids)]
        separation = [separation[0] / len(boids), separation[1] / len(boids)]

        self.acceleration[0] += alignment[0] * 0.01
        self.acceleration[1] += alignment[1] * 0.01
        self.acceleration[0] += cohesion[0] * 0.01
        self.acceleration[1] += cohesion[1] * 0.01
        self.acceleration[0] += separation[0] * 0.01
        self.acceleration[1] += separation[1] * 0.01

        self.velocity[0] += self.acceleration[0]
        self.velocity[1] += self.acceleration[1]
        self.position[0] += self.velocity[0]
        self.position[1] += self.velocity[1]

        # Wrap around the screen
        if self.position[0] > width:
            self.position[0] -= width
        elif self.position[0] < 0:
            self.position[0] += width
        if self.position[1] > height:
            self.position[1] -= height
        elif self.position[1] < 0:
            self.position[1] += height

        self.acceleration = [0, 0]

    def draw(self):
        pygame.draw.circle(screen, blue, (int(self.position[0]), int(self.position[1])), 5)

# Create boids
num_boids = 50
boids = [Boid() for _ in range(num_boids)]

# Main loop
running = True
while running:
    screen.fill(white)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    for boid in boids:
        boid.update(boids)
        boid.draw()

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
