openssl rand -base64 756 > mongo-keyfile
chown 999 -R mongo-keyfile
chmod 600 mongo-keyfile