echo "Run as root only";
cd /home/panshuljindal/sp24-cs411-team108-SQLScholars/backend;
npm run build;
pm2 restart index;
pm2 log index;
