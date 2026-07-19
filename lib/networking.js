// lib/networking.js — a reference glossary of networking fundamentals,
// grouped by category. Complements (doesn't replace) the brief "Networking
// Foundations" subtopic under the REST topic — this is the fuller,
// standalone treatment. Every link is a real, direct article — Cloudflare's
// Learning Center (verified via search) or a stable, well-known Wikipedia
// article — never a site search or a course page.

export const NETWORKING_CATEGORIES = [
  {
    name: 'Models & Layers',
    items: [
      { slug: 'osi-model', t: 'The OSI Model', d: 'Splits network communication into 7 abstract layers — the shared vocabulary for talking about "which layer" a problem lives at.', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/', src: 'Cloudflare' },
      { slug: 'tcp-ip-model', t: 'The TCP/IP Model', d: "The internet's actual 4-layer model — simpler than OSI, and what real protocols map onto in practice.", url: 'https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/', src: 'Cloudflare' },
      { slug: 'network-protocol', t: 'What Is a Protocol?', d: 'A set of rules two systems agree on so they can understand each other — the concept underneath HTTP, TCP, DNS, all of it.', url: 'https://www.cloudflare.com/learning/network-layer/what-is-a-protocol/', src: 'Cloudflare' },
      { slug: 'ip-address', t: 'The Internet Protocol (IP)', d: "Routes packets between machines using addresses — the layer that makes 'send this to that machine' possible.", url: 'https://www.cloudflare.com/learning/network-layer/internet-protocol/', src: 'Cloudflare' },
    ],
  },
  {
    name: 'Transport Layer',
    items: [
      { slug: 'tcp', t: 'TCP (Transmission Control Protocol)', d: 'Ordered, reliable, connection-based delivery via a three-way handshake — the default for anything that can\'t tolerate lost data.', url: 'https://en.wikipedia.org/wiki/Transmission_Control_Protocol', src: 'Wikipedia' },
      { slug: 'udp', t: 'UDP (User Datagram Protocol)', d: 'Fast, connectionless, no delivery guarantee — used where speed matters more than the occasional dropped packet (video calls, DNS).', url: 'https://en.wikipedia.org/wiki/User_Datagram_Protocol', src: 'Wikipedia' },
      { slug: 'ports-sockets', t: 'Ports & Sockets', d: 'A port identifies which application on a machine a connection is for; a socket is the (IP, port) pair that actually identifies one connection.', url: 'https://en.wikipedia.org/wiki/Port_(computer_networking)', src: 'Wikipedia' },
      { slug: 'websockets', t: 'WebSockets', d: 'Upgrades an HTTP connection into a persistent, full-duplex channel — for when the server needs to push data without being asked.', url: 'https://en.wikipedia.org/wiki/WebSocket', src: 'Wikipedia' },
    ],
  },
  {
    name: 'Naming & Discovery',
    items: [
      { slug: 'dns', t: 'DNS (Domain Name System)', d: "The internet's phone book — translates a human-readable hostname into the IP address a connection actually needs.", url: 'https://en.wikipedia.org/wiki/Domain_Name_System', src: 'Wikipedia' },
      { slug: 'dns-load-balancing', t: 'DNS-Based Load Balancing', d: 'Returns different IP addresses to different clients (or reroutes on health checks) so DNS resolution itself spreads load.', url: 'https://www.cloudflare.com/learning/performance/what-is-dns-load-balancing/', src: 'Cloudflare' },
      { slug: 'dhcp', t: 'DHCP', d: "Automatically assigns IP addresses to devices joining a network — why your laptop doesn't need a manually configured IP.", url: 'https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol', src: 'Wikipedia' },
      { slug: 'nat', t: 'NAT (Network Address Translation)', d: 'Lets many devices on a private network share one public IP address — the reason your home devices don\'t each need their own public address.', url: 'https://en.wikipedia.org/wiki/Network_address_translation', src: 'Wikipedia' },
    ],
  },
  {
    name: 'HTTP, TLS & Security',
    items: [
      { slug: 'http-overview', t: 'HTTP Overview', d: 'The request/response protocol almost every web API is built on — methods, headers, status codes.', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', src: 'MDN' },
      { slug: 'tls-ssl', t: 'TLS/SSL', d: "Encrypts a connection so data can't be read or tampered with in transit — the 'S' in HTTPS.", url: 'https://en.wikipedia.org/wiki/Transport_Layer_Security', src: 'Wikipedia' },
      { slug: 'firewall', t: 'Firewalls', d: 'A rule-based filter deciding which traffic is allowed in/out of a network — the whitelist-by-default security baseline.', url: 'https://en.wikipedia.org/wiki/Firewall_(computing)', src: 'Wikipedia' },
      { slug: 'vpn', t: 'VPN (Virtual Private Network)', d: "Creates an encrypted tunnel over an untrusted network, making a remote connection look like it's on a private one.", url: 'https://en.wikipedia.org/wiki/Virtual_private_network', src: 'Wikipedia' },
    ],
  },
  {
    name: 'Scaling Traffic',
    items: [
      { slug: 'load-balancer', t: 'Load Balancers', d: 'Distributes incoming traffic across multiple servers so no single one gets overwhelmed — round robin, least connections, and other algorithms decide how.', url: 'https://en.wikipedia.org/wiki/Load_balancing_(computing)', src: 'Wikipedia' },
      { slug: 'reverse-proxy', t: 'Reverse Proxy', d: 'Sits in front of your servers and forwards requests to them — used for load balancing, TLS termination, and hiding internal topology.', url: 'https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/', src: 'Cloudflare' },
      { slug: 'cdn-networking', t: 'CDN (Content Delivery Network)', d: 'Caches content at edge locations close to users, cutting latency and origin load for anything that doesn\'t change per-request.', url: 'https://developer.mozilla.org/en-US/docs/Glossary/CDN', src: 'MDN' },
    ],
  },
];

export function networkingKey(slug) {
  return 'networking::' + slug;
}

export function totalNetworkingTopics() {
  return NETWORKING_CATEGORIES.reduce((n, c) => n + c.items.length, 0);
}
