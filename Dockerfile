FROM node:22-slim as dependencies

# Define user/group/app dir
ENV APP_DIR=/app

# Define timezone
ENV TZ=America/Sao_Paulo

# Add Maintainer Info
LABEL maintainer="TI-ARQUITETURA-PROJETOS-INTEGRACAO@cs.grupopaodeacucar.com.br"

# Set workdir
WORKDIR ${APP_DIR}

RUN npm cache clean --force
RUN npm rebuild

COPY package.json  ./
RUN npm set audit false
RUN npm install --legacy-peer-deps --verbose 



FROM node:22-slim as builder

# Define user/group/app dir
ENV APP_DIR=/app

# Define timezone
ENV TZ=America/Sao_Paulo

# Add Maintainer Info
LABEL maintainer="TI-ARQUITETURA-PROJETOS-INTEGRACAO@cs.grupopaodeacucar.com.br"

# Set workdir
WORKDIR ${APP_DIR}

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build


FROM nginx:1.25-alpine

# Define timezone
ENV TZ=America/Sao_Paulo

# Add Maintainer Info
LABEL maintainer="TI-ARQUITETURA-PROJETOS-INTEGRACAO@cs.grupopaodeacucar.com.br"

# Make port available to the world outside this container
EXPOSE 8080

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

RUN chmod -R 777 /var/cache/nginx /var/run/

CMD ["nginx", "-g", "daemon off;"]
