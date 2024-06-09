# build stage
FROM node:20-alpine as build-stage
ARG CI_BUILD_REF_NAME
ARG CI_COMMIT_TAG
ARG GIT_COMMIT_SHA
ARG GIT_BRANCH
ENV CI_BUILD_REF_NAME=$CI_BUILD_REF_NAME
ENV CI_COMMIT_TAG=$CI_COMMIT_TAG
ENV GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ENV GIT_BRANCH=$GIT_BRANCH
ENV CONTINUOUS_INTEGRATION=1
ENV HUSKY=0
RUN apk add bash git
WORKDIR /app
COPY package*.json ./
RUN yarn install --link-duplicates --frozen-lockfile
COPY . .
ADD . .
RUN /bin/bash ./scripts/generate-appinfo.sh public/appinfo.json
RUN yarn run build
RUN find /app/dist

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
RUN ls -l /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
