echo "Run as root only";
cd /home/panshuljindal/sp24-cs411-team108-SQLScholars/frontend;
git pull origin frontend;
npm run build;
pm2 restart 0;
pm2 log 0;
