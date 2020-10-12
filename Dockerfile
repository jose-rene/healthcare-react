FROM php:7.4-fpm

ARG DEBIAN_FRONTEND=noninteractive

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    nodejs \
    unzip

RUN apt-get install -y --no-install-recommends yarn && \
        npm install -g npm cross-env

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u 1000 -d /home/deployer deployer
RUN mkdir -p /home/deployer/.composer && \
    chown -R deployer:deployer /home/deployer

# Set working directory
WORKDIR /var/www

USER deployer

# Install Laravel Envoy
RUN composer global require "laravel/envoy=~1.0"
