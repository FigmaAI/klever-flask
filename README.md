# Figma Jupyter Connector

Figma Jupyter Connector는 Figma 플러그인과 Jupyter 노트북을 연결하는 프로젝트입니다.

## 서버 사이드 설정

서버 사이드는 주피터 노트북을 사용하여 구현되었습니다. 주피터 노트북을 웹 서버로 사용하여 HTTP 요청을 처리하고 응답을 반환하는 기능을 제공합니다. 

### 파이썬 환경 설정

1. 파이썬 3.8 이상이 설치되어 있는지 확인하세요. 설치되어 있지 않다면, [공식 파이썬 웹사이트](https://www.python.org/downloads/)에서 다운로드하고 설치할 수 있습니다.

2. (선택사항) 가상 환경을 생성하고 활성화하세요. 이는 프로젝트의 종속성을 격리시키는 데 도움이 됩니다.

```bash
python3 -m venv env
source env/bin/activate
```

### Requirement 설치

1. 필요한 파이썬 패키지를 설치하세요. 이 프로젝트에서는 `jupyter`와 `jupyter_kernel_gateway` 패키지가 필요합니다.

```bash
pip install jupyter jupyter_kernel_gateway
```

### 주피터 노트북 및 커널 게이트웨이 실행

1. 주피터 노트북을 API 서버로 실행하세요.

```bash
jupyter kernelgateway --KernelGatewayApp.api='kernel_gateway.notebook_http' --KernelGatewayApp.seed_uri='api.ipynb' --KernelGatewayApp.allow_origin='*' --KernelGatewayApp.allow_methods='GET,POST,PUT,DELETE,OPTIONS'
```

이제 `http://localhost:8888/hello/world`로 요청을 보내면 `{'message': 'Hello, world!'}` 응답을 받을 수 있습니다.


## 클라이언트 사이드 설정

클라이언트 사이드는 Figma 플러그인을 통해 구현됩니다.

### 빠른 시작

1. `yarn` 명령을 실행하여 프로젝트의 종속성을 설치합니다.
2. `yarn build:watch` 명령을 실행하여 webpack을 감시 모드로 시작합니다.
3. Figma에서 `Plugins` -> `Development` -> `Import plugin from manifest...`를 선택하고 이 레포지토리의 `manifest.json` 파일을 선택합니다.

플러그인의 UI를 변경하려면 [App.tsx](./src/app/components/App.tsx) 파일을 편집하고, Figma API와 상호작용하려면 [controller.ts](./src/plugin/controller.ts) 파일을 편집하세요. 더 자세한 정보는 [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/)를 참조하세요.

