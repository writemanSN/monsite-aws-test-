# Projet Tâches — Spring Boot + React + MySQL + Docker

Petit projet d'exemple pour apprendre à déployer une application complète sur AWS EC2.

## Architecture

- `frontend/` : React + Vite, servi par Nginx sur le port 80.
- `backend/` : Spring Boot 3, Java 21, Maven, API REST.
- `mysql` : MySQL 8.4.
- `compose.yaml` : démarre les trois services avec Docker Compose.
- Nginx transmet les requêtes `/api/...` vers le backend. Le navigateur n'a donc besoin que d'une seule adresse.

## Prérequis

- Docker Engine
- Docker Compose v2 (`docker compose version`)
- Git

Java et Maven ne sont pas nécessaires sur le serveur pour cette version : Docker construit le backend à partir du code source.

## 1. Configuration

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Modifiez les mots de passe dans `.env` avant toute mise en ligne. Ne publiez jamais le fichier `.env` sur GitHub.

## 2. Démarrage local ou sur EC2

Depuis le dossier contenant `compose.yaml` :

```bash
docker compose up -d --build
```

Puis vérifier les conteneurs :

```bash
docker compose ps
docker compose logs -f backend
```

Ouvrir dans le navigateur :

- `http://localhost` en local
- `http://IP_PUBLIQUE_EC2` depuis Internet, si le port 80 est autorisé dans le groupe de sécurité AWS.

## 3. Tester l'API

```bash
curl http://localhost/api/tasks
```

Ajouter une tâche :

```bash
curl -X POST http://localhost/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Tester le déploiement"}'
```

## 4. Publier sur GitHub

Depuis le dossier du projet :

```bash
git init
git add .
git commit -m "Initial commit: Spring Boot React MySQL Docker"
git branch -M main
git remote add origin https://github.com/TON-UTILISATEUR/TON-REPO.git
git push -u origin main
```

Si GitHub demande une authentification HTTPS, utiliser le token comme mot de passe lorsqu'il est demandé. Ne mets jamais le token directement dans une commande, un fichier ou le dépôt. Si tu as déjà configuré SSH, tu peux aussi utiliser l'URL SSH du dépôt.

## 5. Déploiement sur AWS EC2 depuis GitHub

Sur une instance EC2 où Docker et le plugin Compose sont installés :

```bash
git clone https://github.com/TON-UTILISATEUR/TON-REPO.git
cd TON-REPO
cp .env.example .env
nano .env
docker compose up -d --build
docker compose ps
```

Dans le groupe de sécurité AWS, autoriser le port 80 (HTTP) pour tester. Pour une vraie mise en production, configure ensuite HTTPS sur le port 443 avec un domaine et un reverse proxy TLS (par exemple Caddy).

## Commandes utiles

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
docker compose restart backend
docker compose down
```

`docker compose down` arrête et supprime les conteneurs et le réseau, mais conserve le volume de données MySQL. Pour supprimer aussi la base persistante, il faudrait utiliser `docker compose down -v` — à éviter si tu veux garder les données.

## Important

- Change les mots de passe de `.env`.
- `.env` est exclu de Git par `.gitignore`.
- Ce projet est pédagogique : ajoute authentification, validation plus poussée, sauvegardes MySQL, HTTPS et surveillance avant un usage réel.
