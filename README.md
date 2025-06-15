
# AirPods Tracker

## Deploy client to gh-pages
```bash
cd client && ng build --base-href=/AirPods-tracker/ && git push origin --delete gh-pages && npx angular-cli-ghpages --dir=dist/
```

## Create ssl certificate
```bash
cd server && openssl req -x509 -newkey rsa:4096 -nodes -out cert.p
em -keyout key.pem -days 365 -subj "/CN=localhost"
```



