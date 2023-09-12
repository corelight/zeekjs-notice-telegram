const https = require('https');
const fs = require("fs");

let options = {
    key: `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAt5+/g6Hrdv7hu6ja8qs6s/vuG9cZTLBo8JzbpEUZ73TEHzUb
RXATf+p/TnWOvTB3tEq5uwqbuMQd/dcBnGVj6pyHfTuMWnVuVagbOz+iD9oPMQUQ
//+Py5H/yiC0S98MKxKBEIjucj6lGSZ+XAhdq9ytMNswhWjZjREI0/jg18ddLO1d
4M1UvoslnwZkgnYBXUJvxqz9TxFVJmPlMzdhKrx4Qga4Fh9yIRhOg03UH8VE1ejo
9QlxcKMy6aD4Stih8JMl805WR7gJFPdNwPyOL10pZ/M34ofmTrzm2vfYDk5jie45
e6V0m94wrn8rIlDB5FlHQkEhf66TFtYLODbUIQIDAQABAoIBAGsJ4T7fVX4xR+73
mGIbNIYUlpF+Cs5si0+vcE3KxjqS63xxnasVkRhg3sMivglExpK/eJMytOG42O7O
ta6wX9U0V7rFyqQ0jhO6gd1A07y/1Vky5d0E4ZK+UchG1jLgG5zEFZ5I5A6Ou/j0
OnZ1nf0AD6lKLHeoTiDwTCAclRzSqUgkM/vCq1hBAuKnk+D/PW0zqtkrsul9XK4y
jYNdtVHzZ1YznrQoGpcT3BZOJXCUDAwXrZTKK8H0XJk4PSXOxepB9Zv1SvRLVdqc
31rDaxoqPEVYW195lFmVNeh9S9n2/y8I0XncbaBXVQCba6JKVMYZj5IOx8AyNGfc
xHm7rZ0CgYEAw+ne+48TTJTieBAcsrnpPGcQggThUPJOt9LBk0E/gvFRaJi4rr1q
XjeG9T/QBW38xMynUobxIcgx1tj8I+ibScCQxieYbtlwLgD+ibcp+dn7Y6WU+H1Q
Siex3pEV+m6+8+Ua48QlSFq/3EhW+8dBjhkIPjrH5i/4fEwGyh7rnesCgYEA7/D3
E7WkPv91xOnjzPjuPWxk5YQMaxDsMzmt6jM92xqYYpbkAasqO9zfe1SlAOaJiiWo
Nag6anKqh3vgBHoRrq1+bni5uWW6bCtcN1h+jlGbYpmZ+44dMF14z/K/SvE/PmQW
M31xhx9AbdK+m8D0qLfEcV+rnIYJdZrXpEjIdyMCgYB2Lmhyu7Zaph2Pa7jEH94Q
r+OHa0Y4PFM8FIjtOZkEdmozfJ0728uEll51J09nVxf557Kv1/Mx+8AE6NQBHVo/
vUgYIN6VT9maBsOFc9aAf/xj+gjJdV6vvQ5RQphNf+z016nG6BXNdeDzEzhVnbdv
7q3ITFE2DI4K/RnDZ6+ejQKBgAx7G08SJr4EKcsZY3kZBcN6LPFnYgH7ul2bxXkm
OzR3eK/AK5IOpj7A6XsP1xlp5IOkG9DWtFsvJcGwZuG0u9C7Q5VZgEeti/nuc3iJ
iOO8SPnjBYh5RvlqE0u108+BJwoGyMTa5JnjvUU5LiMJ8XAJRxWipVmZ+0n7yPXJ
t2vDAoGAIncgIi6+pj5PpKrZJ4FktBQV3DgHIsixKqZRdqMNRLlb7VObeyZNlz2g
n6azCfPNEQuvZTVxB1eRpoGz9hei/uQ2E3zynTh2WoHBKYtXHzpG4kbmb7hew1ME
3OVr9WkxCgSgCgi2j2L8bxoyAQFo5/ssRsVv3jtR+O5hPSjJ5q8=
-----END RSA PRIVATE KEY-----`,
    cert: `-----BEGIN CERTIFICATE-----
MIIDKTCCAhGgAwIBAgIIHfKlWiUPni4wDQYJKoZIhvcNAQELBQAwIDEeMBwGA1UE
AxMVbWluaWNhIHJvb3QgY2EgMmY5OTQ5MCAXDTIzMDkxMjA0MDYwMFoYDzIxMjMw
OTEyMDQwNjAwWjAUMRIwEAYDVQQDEwkxMjcuMC4wLjEwggEiMA0GCSqGSIb3DQEB
AQUAA4IBDwAwggEKAoIBAQC3n7+Doet2/uG7qNryqzqz++4b1xlMsGjwnNukRRnv
dMQfNRtFcBN/6n9OdY69MHe0Srm7Cpu4xB391wGcZWPqnId9O4xadW5VqBs7P6IP
2g8xBRD//4/Lkf/KILRL3wwrEoEQiO5yPqUZJn5cCF2r3K0w2zCFaNmNEQjT+ODX
x10s7V3gzVS+iyWfBmSCdgFdQm/GrP1PEVUmY+UzN2EqvHhCBrgWH3IhGE6DTdQf
xUTV6Oj1CXFwozLpoPhK2KHwkyXzTlZHuAkU903A/I4vXSln8zfih+ZOvOba99gO
TmOJ7jl7pXSb3jCufysiUMHkWUdCQSF/rpMW1gs4NtQhAgMBAAGjcTBvMA4GA1Ud
DwEB/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0T
AQH/BAIwADAfBgNVHSMEGDAWgBTxijEZr5e22TVGC2d1+/QVyVavwTAPBgNVHREE
CDAGhwR/AAABMA0GCSqGSIb3DQEBCwUAA4IBAQAzPupizvlQ2DIU8mBtd3jmCauY
WSkUunemh9uPoFvB/vIauxRHjZ/MxgUJi2maFuLJVCKyUs7R4vYcF1SMSoxDTJL7
wv8aD1Q2j8i7749Wnj7tCdrAed9WMu45FLr7Cv4qrppPWJ8mqpp9aY65nQ4NEpRv
E4cK2mLPfmFDk41KN96Ulcxtx/WtJRxodxuTOGc1olQbtrbx610/DhhLfRSfQ1vd
7XN+yACNkcP2ZkbOi58km0EH1sHCChd13H68UWXD4TBseBZcVfntuNGU5wZcmyoW
80nfhqRFlCbMobU04unC19CsUuKRqKC0dT7CrXgLfvwivWLyi3CdsMavEdGG
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

    res.end(resp);
    server.close();
    zeek.invoke('terminate')
});

const port = parseInt(process.env.MOCK_PORT);

// Required to prevent libnode from catching SIGTERM when zeek terminates?!
process.on('SIGTERM', () => {});

server.listen(port, "127.0.0.1");
