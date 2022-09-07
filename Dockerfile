FROM node

RUN npm install pm2 -g

WORKDIR /usr/src/app/


WORKDIR /usr/src/app/frontend
COPY srcs/frontend/ .
RUN npm install
RUN npm run build

WORKDIR /usr/src/app/backend/
COPY srcs/backend/ .
RUN npm install
RUN npx prisma migrate deploy

EXPOSE 3000
EXPOSE 3334

ENTRYPOINT cd /usr/src/app/backend && pm2 --name nestjs start npm -- start && cd /usr/src/app/frontend && pm2 --name react start npx -- serve -s build