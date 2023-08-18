# Figma Plugin with Flask + Jupyter Notebook Backend

이 플러그인은 Figma와 함께 사용되는 Flask + Jupyter Notebook 기반의 백엔드 서버입니다. 주피터 노트북에서 Flask 애플리케이션을 실행하면, 코드 변경을 감지하고 자동으로 서버를 재시작하는 실시간 업데이트 기능을 사용할 수 있습니다.

## 사용법

### 1. 클라이언트 사이드 설정

클라이언트 사이드는 Figma 플러그인을 통해 구현됩니다.

#### 빠른 시작

1. `yarn` 명령을 실행하여 프로젝트의 종속성을 설치합니다.
2. `yarn build:watch` 명령을 실행하여 webpack을 감시 모드로 시작합니다.
3. Figma에서 `Plugins` -> `Development` -> `Import plugin from manifest...`를 선택하고 이 레포지토리의 `manifest.json` 파일을 선택합니다.

플러그인의 UI를 변경하려면 [App.tsx](./src/app/components/App.tsx) 파일을 편집하고, Figma API와 상호작용하려면 [controller.ts](./src/plugin/controller.ts) 파일을 편집하세요. 더 자세한 정보는 [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/)를 참조하세요.

### 2. 백엔드 설정

먼저, 필요한 패키지를 설치합니다. 이 프로젝트는 Python 3.6 이상에서 작동하며, 가상 환경에서 실행하는 것이 좋습니다.

```bash
pip install flask jupyter
```

### 3. Jupyter Notebook 실행

다음으로, 주피터 노트북을 실행합니다.

```bash
jupyter notebook
```

### 4. Flask 애플리케이션 작성 및 실행

주피터 노트북에서 `api.ipynb`를 열어 Flask 애플리케이션을 작성하고 실행합니다. 이 노트북 파일에는 Flask 애플리케이션을 설정하고 `/hello/world`와 `/hello2` 두 개의 엔드포인트를 정의하는 코드가 포함되어 있습니다.

### 5. Figma 플러그인에서 테스트

이제 Figma 플러그인을 사용하여 `http://localhost:5000/hello/world` 또는 `http://localhost:5000/hello2`로 요청을 보낼 수 있습니다.

> 플러그인 코드를 변경하면, Figma가 변경사항을 자동으로 반영합니다. Flask 애플리케이션을 변경하면, Flask의 개발 서버가 변경사항을 감지하고 자동으로 서버를 재시작합니다. 