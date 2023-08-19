
# Figma Plugin with Flask + Jupyter Notebook Backend

이 플러그인은 Figma와 함께 Flask + Jupyter Notebook 기반의 백엔드 서버를 사용하는 방법을 설명합니다. 

## 빠른 시작

### 1. 클라이언트 사이드 설정

클라이언트 사이드는 Figma 플러그인을 통해 구현됩니다.

1. `yarn` 명령을 실행하여 프로젝트의 종속성을 설치합니다.
2. Figma에서 `Plugins` -> `Development` -> `Import plugin from manifest...`를 선택하고 이 레포지토리의 `manifest.json` 파일을 선택합니다.

플러그인의 UI를 변경하려면 [App.tsx](./src/app/components/App.tsx) 파일을 편집하고, Figma API와 상호작용하려면 [controller.ts](./src/plugin/controller.ts) 파일을 편집하세요. 더 자세한 정보는 [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/)를 참조하세요.

### 2. 백엔드 설정

먼저, 필요한 패키지를 설치합니다. 이 프로젝트는 Python 3.6 이상에서 작동하며, 가상 환경에서 실행하는 것이 좋습니다.

```bash
pip install flask jupyter
```

### 3. Jupyter Notebook과 Figma 플러그인을 실행

- `yarn build:watch` 명령을 실행하여 webpack을 감시 모드로 시작합니다.
- 다음으로, `jupyter notebook` 명령으로 주피터 노트북을 실행합니다.


### 4. Flask 서버 작성 및 실행

주피터 노트북에서 Flask 웹서버를 작성하고 실행합니다. 
예시로 이 저장소에서는 `api.ipynb`을 제공합니다. 해당 파일에는 Flask 애플리케이션을 설정하고 `/hello/world`와 `/hello2` 두 개의 엔드포인트를 정의하는 코드가 포함되어 있습니다.

## 동작 방식

 `api.ipynb`에서 Figma 플러그인과 Jupyter Notebook은 아래와 같이 정보를 주고 받습니다. 

- **POST API 시나리오**
    1. Jupyter Notebook에서 Flask 서버를 시작합니다.
    2. Figma 플러그인에서 Jupyter로 데이터를 전송하라는 요청을 보냅니다.
    3. Figma 플러그인은 데이터를 Jupyter Notebook으로 전송합니다.
    4. Jupyter Notebook은 전송받은 데이터를 저장하고 Flask 서버를 중지합니다.
- **GET API 시나리오**
    1. Jupyter Notebook에서 Flask 서버를 시작합니다.
    3. Figma 플러그인은 서버에 요청을 보냅니다.
    4. Jupyter Notebook은 요청을 처리하고 데이터를 Figma 플러그인으로 반환합니다.
    5. Jupyter Notebook은 200 OK를 반환하고 Flask 서버를 중지합니다.

