#!/bin/bash

#! /bin/bash

if [ "$#" -ne 1 ]
then
  echo "Error: No domain name argument provided"
  echo "Usage: Provide a domain name as an argument"
  exit 1
fi

DOMAIN=$1

# Create root CA & Private key

openssl req -x509 \
            -sha256 -days 356 \
            -nodes \
            -newkey rsa:2048 \
            -subj "/CN=${DOMAIN}/C=IN/L=New Delhi" \
            -keyout rootCA.key -out rootCA.crt 

# Generate Private key 

openssl genrsa -out keycloak-kf.key 2048

# Create csf conf

cat > csr.conf <<EOF
[ req ]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[ dn ]
C = IN
L = New Delhi
O = Convobot
OU = Convobot Dev
CN = ${DOMAIN}

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = ${DOMAIN}
DNS.2 = www.${DOMAIN}
IP.1 = 127.0.0.1

EOF

# create CSR request using private key

openssl req -new -key keycloak-kf.key -out keycloak-cert.csr -config csr.conf

# Create a external config file for the certificate

cat > cert.conf <<EOF

authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${DOMAIN}

EOF

# Create SSl with self signed CA

openssl x509 -req \
    -in keycloak-cert.csr \
    -CA rootCA.crt -CAkey rootCA.key \
    -CAcreateserial -out keycloak-cert.crt \
    -days 365 \
    -sha256 -extfile cert.conf

# Delete secret
kubectl delete secret keycloak-cert
kubectl create secret tls keycloak-cert --key keycloak-kf.key --cert keycloak-cert.crt

# Clean up
rm -f csr.conf cert.conf keycloak-cert.csr rootCA.srl