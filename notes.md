好的，这是一个非常完整的项目启动需求，涉及到多服务架构和容器化部署。我们将从零开始，一步步建立这个 **OJ (Online Judge) 系统**项目，并使用 Git 进行版本控制。

我会将步骤拆分，让您能清晰地知道每一步的操作和目的。

-----

## 🚀 **项目初始化与 Git 建立：OJ 系统**

### 阶段 1: 建立项目结构和 Git 仓库

首先，在您的系统上创建一个干净的项目目录，并初始化 Git。

#### 步骤 1.1: 创建主目录和子目录

```bash
# 1. 创建项目根文件夹
mkdir oj_system
cd oj_system

# 2. 创建服务子文件夹
mkdir backend frontend nginx data
```

> **项目结构现在：**
>
> ```
> oj_system/
> ├── backend/
> ├── frontend/
> ├── nginx/
> ├── data/  <-- 用于存放持久化数据，如 PostgreSQL 数据文件
> └── .
> ```

#### 步骤 1.2: 初始化 Git 仓库

```bash
git init
```

> **意义：** 在本地建立“时间机器”，开始追踪文件变化。

#### 步骤 1.3: 创建 `.gitignore` 文件

为了保持仓库干净，我们创建 `.gitignore` 文件并添加必要的规则。在 `oj_system` 目录下创建文件 `.gitignore`：

```bash
touch .gitignore
```

**编辑 `.gitignore` 文件内容：**

```gitignore
# ----------------------------------------------------
# 1. 忽略虚拟环境
# ----------------------------------------------------
venv/
.venv/
env/

# ----------------------------------------------------
# 2. 忽略 Python 缓存和 Django 数据库
# ----------------------------------------------------
__pycache__/
*.pyc
db.sqlite3
*.log

# ----------------------------------------------------
# 3. 忽略 Node/React 缓存和依赖 (Frontend)
# ----------------------------------------------------
node_modules/
build/
.cache/
npm-debug.log

# ----------------------------------------------------
# 4. 忽略持久化数据（Docker Volume的内容）
# ----------------------------------------------------
# 虽然 data 文件夹在 docker-compose 中会被用作卷，
# 但为了保持 Git 仓库轻量，我们只追踪配置，不追踪数据本身。
data/
```

#### 步骤 1.4: 首次提交历史快照

```bash
# 1. 将所有结构和 .gitignore 添加到暂存区
git add .

# 2. 提交首次历史记录
git commit -m "feat: initialize project structure with backend, frontend, nginx and gitignore"
```

-----

### 阶段 2: 定义 Docker Compose 架构

现在我们来创建核心的部署蓝图：`docker-compose.yml`。

#### 步骤 2.1: 创建 `docker-compose.yml`

在 `oj_system` 目录下创建文件 `docker-compose.yml`。

**编辑 `docker-compose.yml` 内容：**

```yaml
version: '3.8'

services:
  # -------------------- 1. 后端服务 (Django) --------------------
  backend:
    build:
      context: ./backend # 从 backend 目录下的 Dockerfile 构建镜像
      dockerfile: Dockerfile.backend
    container_name: oj_backend
    env_file:
      - .env # 环境变量文件
    volumes:
      - ./backend:/app # 映射代码目录，方便开发
    ports:
      - "8000:8000" # Django 默认端口
    depends_on:
      - db
    restart: always

  # -------------------- 2. 数据库服务 (PostgreSQL) --------------------
  db:
    image: postgres:14-alpine
    container_name: oj_postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data # 数据持久化
    environment:
      POSTGRES_DB: oj_db
      POSTGRES_USER: oj_user
      POSTGRES_PASSWORD: oj_password
    restart: always

  # -------------------- 3. 前端服务 (React) --------------------
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    container_name: oj_frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules # 确保本地 node_modules 不会覆盖容器内的
    ports:
      - "3000:3000" # React 默认端口
    restart: always

  # -------------------- 4. Nginx 反向代理 --------------------
  nginx:
    image: nginx:stable-alpine
    container_name: oj_nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro # 映射 Nginx 配置
      - ./frontend/build:/usr/share/nginx/html:ro # 映射前端静态文件 (生产环境)
    ports:
      - "80:80" # 暴露 80 端口给外部访问
    depends_on:
      - backend
      - frontend
    restart: always

volumes:
  postgres_data: # 定义一个持久化卷用于存储数据库数据
```

#### 步骤 2.2: 提交 Docker 配置

```bash
git add docker-compose.yml

git commit -m "config: add initial docker-compose setup for 4 services (backend, db, frontend, nginx)"
```

-----

### 阶段 3: 后续文件准备（Django 和 Nginx）

为了让 `docker-compose` 正常工作，我们还需要两个配置文件：

#### 步骤 3.1: 创建 `backend/Dockerfile.backend`

在 `backend` 目录下创建 `Dockerfile.backend`：

```dockerfile
# 使用官方 Python 基础镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装依赖 (提高缓存效率)
COPY backend/requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目代码
COPY backend/ .

# 定义默认命令 (Django)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

#### 步骤 3.2: 创建 `nginx/nginx.conf`

在 `nginx` 目录下创建 `nginx.conf`：

```nginx
server {
    listen 80;

    # Nginx 代理前端请求 (例如: 网站首页)
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Nginx 代理 API 请求到 Django 后端
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 可选: 代理静态文件 (如果需要 Django 提供静态文件)
    # location /static/ {
    #     alias /path/to/django/static/;
    # }
}
```

#### 步骤 3.3: 提交剩余配置

```bash
git add backend/Dockerfile.backend nginx/nginx.conf

git commit -m "config: add initial Dockerfile for backend and nginx reverse proxy config"
```

-----

**现在，您的项目结构和初始配置已经建立完毕，并且所有核心配置都已提交到 Git。**

**下一步：** 您想先开始搭建 **Django 后端** 的基本文件，还是先开始设置 **GitHub 远程仓库** 呢？