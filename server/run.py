import ssl

import uvicorn

if __name__ == "__main__":
    ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_context.load_cert_chain('cert.pem', keyfile='key.pem')
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        ssl_keyfile="key.pem",
        ssl_certfile="cert.pem"
    )
