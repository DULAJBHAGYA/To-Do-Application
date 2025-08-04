# Use an official Maven image to build the application
FROM maven:3.8.5-openjdk-17 as build

# Set the working directory
WORKDIR /app

# Copy the pom.xml
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src src

# Build the application
RUN mvn clean install -DskipTests

# Use a smaller base image for the final image
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]