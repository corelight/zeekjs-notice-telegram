const https = require('https');
const fs = require("fs");

let options = {
    key: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAsW4aLmHtd7sytYpBPXpR77aLjcKlmE9JSm+UIJ0zRQY35aVb
Cz0Wzce7PyynigceWO1e0P/XSQLJJYw/FeEXkoot3XhsDKlVIT8FA8thMi3O9kYl
UmOlJTjcA2PvSm5UWMBBFGruoaB+W/K4KHKyQ+UAVYnImvcHB7AQciVUerXoERVG
lWqswdzyXj5Q+yPv3PK0qvGbq1ikLcP+K2TZeiE4bba4OhMLfvPIf2V1qcXvPrRD
/kSKZD1skZxPxChseR+oIye/DV86nzzrwbYP9aBPf22h+vGri1g9KyLzcANo4xGv
eeDhrutE8nQIcPr7w4443LRJORBRslt/Qk1epQIDAQABAoIBAG0x0oELGYcfORUK
sh3wwq5hTL+AtELpQLTDuIjd1ii7q/jz6/UdsoQQUMePZsiGmwGljD3ZxheT1FD8
X/LKJaS0z4dGTlD4gYDFdQOhzf6AvKdKAjwTQRaISLb5cNIA1n4MS8ESEix8Rme2
F+oktFseezcpZcEhGD19+JEXMkeV15Bd3SdW7WdbynBIJ4N8HTFpr747+dRJYGLX
Ogx2S4xjCnmhvF7sohz3bJfr7gK5dYGclaAZ25bEwJx42ZnFfRs4ygxQMwXDJrEe
yuO9vCIdjwANtsY6v+JzrwOWKCUE1yQcdjTx9p/72tP1vIdT63cvcnnUuVF5NhPV
ZWs/ioECgYEA2K3VPlIh2vuTUcyu4t44OoxLXF6oL6SRFtV/j8Pw2HgWB30IvDIs
qxCaJ8Prz649DDxP454/KWcCnEnnVmoG0Td+DmX7YDcVNeONbnCI4NOMHqL3fJVB
mrH5fgH+7g8j3XJZNKZqlheHEWUUMM/0SXXykADoWC+5FKcjUvkAPQUCgYEA0aDl
ulmjfYBileYH5oiYqGBOejLcoznfceX2uUO1ySyNoe2TFDC37YzM5SPLNbW4JXAy
h9zd2CjTgtskZeDS48fmVQyhwLEEe4Md1beKHroGhlJhf/cXbbgu/NwXaTFW5UqA
I+/qUveUXwTOKMBsNttIlxJzZdEOoTokFscvTSECgYBGiN//95CZzod4e17670fy
lzT5Dr9FMxcgDcQGssw2S3EwYt1zFgpAbZkhFMAwzRGGaCPBfwQkoCnTYqNyF/W8
KYpZeY1JFuVKs5aYuv1z4qmcV4SlA5llmEYVZOTt7fPI5K5xWzMbRPFtEjBua2Ok
fkbF5eW8v1xKgtYW7oPLWQKBgQCl6A1o+uClxyI/OJswHROUzwPNOsvcc0Ugw7wM
zEXnPdeqPHiXFie7XiAbicSecX+YQb/8PxVkqosbmYypBNJjbCYjUagC9RZzGkZW
irhJsTjQvgpkWI62S3sErLvqiR4YwmnAB3UQzNkkio0PO5tpnwtIZVXnUxmdCILf
dC0/gQKBgQDBHFKnSNlxpJHtz/YhNeYH1xihmtLVUo6Tbk37Oi3CBBdgDBQdO8d5
S3WkDx6v5oCP/oARhYSHMboGwjeMggWPKRmFX5+HQz4PrQbsxnNg6oeyWjZ56+Wx
DBjk7dQbiTIdRDQ1pmpJpxUCfdjyELVYxuailKsc7rvAeySo6z8JAg==
-----END RSA PRIVATE KEY-----`,
    cert: `-----BEGIN CERTIFICATE-----
MIIDLDCCAhSgAwIBAgIIWNQY5RLpVfYwDQYJKoZIhvcNAQELBQAwIDEeMBwGA1UE
AxMVbWluaWNhIHJvb3QgY2EgMjE4MjgwMB4XDTIzMDUxMDAxNTAyOFoXDTI1MDYw
OTAxNTAyOFowFDESMBAGA1UEAxMJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAsW4aLmHtd7sytYpBPXpR77aLjcKlmE9JSm+UIJ0zRQY3
5aVbCz0Wzce7PyynigceWO1e0P/XSQLJJYw/FeEXkoot3XhsDKlVIT8FA8thMi3O
9kYlUmOlJTjcA2PvSm5UWMBBFGruoaB+W/K4KHKyQ+UAVYnImvcHB7AQciVUerXo
ERVGlWqswdzyXj5Q+yPv3PK0qvGbq1ikLcP+K2TZeiE4bba4OhMLfvPIf2V1qcXv
PrRD/kSKZD1skZxPxChseR+oIye/DV86nzzrwbYP9aBPf22h+vGri1g9KyLzcANo
4xGveeDhrutE8nQIcPr7w4443LRJORBRslt/Qk1epQIDAQABo3YwdDAOBgNVHQ8B
Af8EBAMCBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMAwGA1UdEwEB
/wQCMAAwHwYDVR0jBBgwFoAUG28npg2T2M70Eq10QdkSd1Q9HDUwFAYDVR0RBA0w
C4IJbG9jYWxob3N0MA0GCSqGSIb3DQEBCwUAA4IBAQBcIW3zjcGsp6dcNU5teAJD
RkJvqRDoCnDMFasq9fUGgmxW1Mq2Bj1X3KEGoYYoOAqDKig8GKHSNntOnax4m2hC
sTPy0ofdcvTJuRQKeDp7vz8Vsq7dlYpK9LWfNdG5PKRBeBT1U7lisznWz9djx7YH
+4W6lZDaPMruCr9zr45XhkZIDoLgjUqK9cKQihOQhGc1ArxOGfMB5pVr58Fo7WqZ
hvan9sKY1cbLjKF+lc5Ba6LAKKKVUeesJjstv+8LRIphfCyw8pT6OR4De+wRbnG7
OxZv0E1wA1nfTVrG/2ydPmKy9uY16rD+Ute2vc55SBF8MAxbDkUFv51t7KzyVHnU
-----END CERTIFICATE-----`
};

const server = https.createServer(options, (req, res) => {
    let resp = `{"ok":true}\n`;

    console.log(`request url = ${req.url}`);

    if (req.url.startsWith('/bot')) {
        console.log("responding with success")
        res.writeHead(200)
    } else if (req.url.startsWith('/corrupt')) {
        console.log("responding with bad JSON")
        res.writeHead(200)
        resp = `{{{`;
    } else {
        console.log("responding with error")
        res.writeHead(404)
        resp = `{"ok":false}\n`;
    }

    zeek.invoke('terminate')
    return res.end(resp);
});

const port = parseInt(process.env.MOCK_PORT);

server.listen(port, "localhost");

