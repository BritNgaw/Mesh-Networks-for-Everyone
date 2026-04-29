# Mesh Networks for Community Resilience

This project is an interactive website that explores how mesh networks can keep people connected when traditional internet infrastructure goes down.

In situations like war, natural disasters, or power outages, centralized communication systems often fail. Mesh networks offer an alternative approach by allowing devices to connect to each other directly and share connectivity across a distributed system.

---

## What this project includes

- **Ukraine case study** based on MITRE’s StarMesh++ work, showing how portable, low-cost systems were used to restore communication in a war-torn environment  
- **Interactive tutorial** where users try to restore connectivity during a blackout by placing network nodes  
- **Map and examples** of real-world outages and how mesh networks could be deployed  
- **Community case studies** including Red Hook, Brooklyn and a proposed network based on a telecommunications technician’s experience  
- **Survey insights** based on responses from NYU and Cornell Tech students about how people think about backup internet and community infrastructure  

---

## Why this matters

When communication goes down, it affects everything—emergency response, coordination, access to information, and basic safety. This project looks at how communities can build more resilient systems that don’t rely entirely on centralized providers.

Mesh networks aren’t just a technical idea—they depend on participation, placement, and real-world constraints. This site is meant to make those tradeoffs more tangible.

---

## How to run locally

```bash
unzip mesh-network-website.zip
cd mesh-network-website
python3 -m http.server 8000
