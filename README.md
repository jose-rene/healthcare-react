# DME-CG

# Dev

## Local dev

### Database
Before doing anything create the mysql database with something like
```bash
mysql -uUSER -p -e"create database dme";
```

### Configs

In the api directory copy the .env.example to .env 
```bash
cd API
cp .env.example .env
``` 
Set your configs in there. You should only need to update the mysql ones.

Generate the IDE key
```bash
php artisan key:generate --ansi
``` 

### install
* run `yarn full:install`

### start the queueing server, web api server, and the app
* run `yarn start`

Yarn start does a few things. It will also open xterm and run yarn start in the app directory
xterm should exist on macs and linux systems but might break in windows. 

## TODOs

### APP

install axios and implement it in the action for logging in
