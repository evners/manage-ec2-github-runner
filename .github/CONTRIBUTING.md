## 🤝 Contributing Guidelines

We’re building this as a high-quality, production-ready open source GitHub Action — and your contributions are not only welcome, but truly appreciated. Whether it's fixing a bug, suggesting improvements, writing documentation, or creating new features — you're helping make the project better for everyone.

<br>

### 🧭 Overview

Welcome! 👋  
This guide will help you get started quickly and ensure a smooth and enjoyable contribution experience for everyone.  
We aim to foster a collaborative, respectful, and high-quality open-source project.

Here’s a quick overview of the tools, standards, and processes we use to keep everything clean, consistent, and secure:

| 🔧 Tool / Process          | 💬 Purpose |
|----------------------------|------------|
| **Semantic Versioning**     | We follow [Semantic Versioning](https://semver.org/) to manage releases (e.g., `1.0.0`). |
| **semantic-release**        | Automated versioning, changelog generation, and publishing based on conventional commits. |
| **pnpm**                    | Fast, efficient package manager for managing Node.js dependencies. |
| **Node.js**                 | Our GitHub Action is built and runs on Node.js 20 LTS. |
| **GitHub Actions**          | CI/CD workflows for building, testing, and releasing the action. |
| **Dependabot**              | Automated dependency updates for security and stability. |
| **CodeQL**                  | Automated code scanning for security vulnerabilities. |
| **Prettier** & **ESLint**   | Enforced code style and linting rules to keep the codebase clean and consistent. |
| **act**                     | Local GitHub Actions runner to test workflows before pushing. |
| **Security Policy**         | We handle vulnerabilities responsibly — please review our [Security Policy](./SECURITY.md). |

⚡ **In short**: You’ll find a fast setup, clear rules, automated testing, automated releases, and a strong focus on quality and security.

> _If anything feels unclear or you're stuck, feel free to open a discussion or ask for help. We're happy to support contributors of all levels._ ✨

<br>

### ✅ Commit Message Guidelines

We follow the **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** specification to ensure clear commit history, automated changelog generation, and semantic versioning via `semantic-release`.

Here’s a quick reference:

| 🎯 Type      | 💬 Description                                    |
|--------------|---------------------------------------------------|
| `feat`       | Introduce a new feature                           |
| `fix`        | Fix a bug or regression                           |
| `docs`       | Documentation-only changes (e.g., README, comments) |
| `chore`      | Maintenance tasks that don't affect the code (e.g., updating dependencies, workflows) |
| `refactor`   | Code changes that neither fix a bug nor add a feature (e.g., restructuring code) |

<br>

### Example Commit Messages

```bash
feat: add support for configuring subnet id
fix: handle missing runner labels gracefully
docs: update readme with new usage examples
chore: bump dependencies to latest versions
refactor: simplify ec2 instance creation logic
```
<br>

### 🧑‍⚖️ Code of Conduct

We are committed to fostering a welcoming and respectful community, please read our [code of conduct](./CODE_OF_CONDUCT.md) before participating.

<br>

### 🛡️ Security

If you find a security vulnerability:
- Do **not** open a public issue
- Email us at: **security@evners.com**
- Review our [Security Policy](./SECURITY.md) for detailed guidelines
- Make sure to check and follow the project's **Security Rules** and disclosure practices

We aim to respond within **48 hours** and fix critical issues promptly to keep the community safe.

<br>

### 🌟 Thanks

Thanks again for contributing! Your work makes this project stronger, faster, and more reliable for everyone. ❤️
