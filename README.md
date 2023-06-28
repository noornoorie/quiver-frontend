# QUIVER

This template should help get you started developing with Vue 3 in Vite.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Project Setup with Docker

Build the Docker image:

```sh
docker build -t qfa .
```

Run a container based on this image:

```sh
docker run --rm -d --name qfa-server -p 8083:80 qfa
```
