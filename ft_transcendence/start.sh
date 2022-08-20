sudo npm install pm2 -g
cd backend && docker-compose up -d
npm install
pm2 --name nestjs start npm -- start
cd ../frontend
npm install
pm2 --name react start npm -- start
