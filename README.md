# Energy Monitoring Service (web)

- 데이터센터(Containment / Rack / Server)의 온도·부하·PUE 모니터링 및 제어를 위한 웹 대시보드와 API 서비스
- 실시간 MQTT 데이터 수집 및 DB 적재, 서비스 데이터 주기적 자동 업데이트 지원
- 배포: Docker / docker-compose + Kubernetes 매니페스트(`k8s/`) 지원

## 기술 스택

- 백엔드: Python 3.12, FastAPI
- WSGI/ASGI 서버: `gunicorn` + `uvicorn` workers
- DB: PostgreSQL
- ORM / DB 드라이버: SQLAlchemy, psycopg2
- 템플릿: Jinja2 (서버 사이드 렌더링 HTML 템플릿)
- MQTT 클라이언트: paho-mqtt (센서 데이터 연동 가능)
- 컨테이너화: Docker (각 서비스용 `Dockerfile`)로 로컬/개발 구성
- 배포 : GKE + kubernetes

## 폴더 구조 개요

- `service/` : FastAPI 기반 웹 서비스

  - `Dockerfile` : 서비스 이미지 빌드 설정
  - `requirements.txt` : Python 의존성
  - `main.py` : FastAPI 앱 엔트리포인트, 라우터 등록, 템플릿/정적 파일 설정
  - `core/` : 도메인별 로직(예: `db`, `containment`, `rack`, `server`, `info`) — CRUD, 라우터 포함
    - `core/dataSubscribers` : MQTT 활용한 데이터 subscriber - db committer
  - `templates/` : Jinja2 템플릿(HTML)
  - `static/` : JS/CSS 및 클라이언트 리소스(차트 렌더링, AJAX 호출 등)

- `k8s/` : Kubernetes 매니페스트
  - `postgres/` : Postgres 초기화 SQL, 매니페스트
  - `server/`, `host/` : 서버/Gateway 호스트용 배포 설정

## 실행 방법 (로컬 Docker)

1. Docker, docker-compose 설치
2. 루트에서:

```powershell
docker-compose up --build
```

3. 브라우저에서 `http://localhost:8080` 접속 (서비스가 `service/Dockerfile`에서 `EXPOSE 8080` 및 `gunicorn`으로 바인딩됨)

DB 접속 포트는 `docker-compose.yaml` 설정을 확인 (예: host 5433 -> container 5432 매핑 등).

## 엔드포인트 및 동작(개요)

- 서버 렌더링 페이지

  - `/` : 메인 대시보드 (`mainPage.html`)
  - `/energy` : PUE(전력 효율) 페이지
  - `/containment` : 컨테이너 온도 페이지
  - `/server` : 서버 온도 페이지
  - `/cooler` : 냉각 장치 상태 페이지
  - `/hardware` : 등록된 하드웨어 정보 페이지
  - `/controller` : 등록된 하드웨어에 대한 제어신호 전송 페이지

- API (예)
  - `/api/rack/*` : 랙 관련 온도/부하 데이터 제공 (프론트의 AJAX 호출 대상)
  - 기타 `core` 모듈에 도메인별 CRUD 및 조회 엔드포인트 존재

## Kubernetes 배포

- Google Cloud Console GKE 기준으로 개발
- gcloud console, kubectl 설치 필요
- regional cluster 생성 및 연결
- 전용 namespace 설정

```bash
kubectl create namespace <namespace-name>
```

- DB StatefulSet, Service, Secret, Configmap

```bash
kubectl create -f k8s/postgres/db.yaml
```

- FastAPI Server

```bash
kubectl create -f k8s/server/web.yaml
```

- Gateway API

```bash
kubectl create -f k8s/host/gateway.yaml
```

- 자세한 개발 과정과 실행 방법 등은 아래 블로그 포스팅에서 확인하실 수 있습니다.

### Kubernetes 블로그 포스팅

- Dockerfile 구성, Docker compose로 확인하기
  : https://dnai-deny.tistory.com/127
- 백엔드 워크로드 구성파일 만들기 : https://dnai-deny.tistory.com/128
- DB 워크로드 설정하기 : https://dnai-deny.tistory.com/129
- Gateway API로 배포하기 : https://dnai-deny.tistory.com/130
