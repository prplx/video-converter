FROM node:10.16 as build-deps

ARG REACT_APP_API_URL=unknown
ARG REACT_APP_ASSET_TAG=unknown

ENV REACT_APP_API_URL=$REACT_APP_API_URL \
  REACT_APP_ASSET_TAG=$REACT_APP_ASSET_TAG

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.17-alpine
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
