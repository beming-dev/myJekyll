---
layout: post
category: React+NodeJS
thumbnail: reactNode.jpg
tags: [React, NodeJS]
typora-copy-images-to: ..\assets\images
typora-root-url: ..
---
React와 Nodejs로 쇼핑몰 만들기 프로젝트를 하면서 가장 먼저 마주친 문제는 React와 Nodejs를 어떻게 같이쓰지? 파일 구조는 어떻게 짜야하지? 였다.

그래서 구글링을 해봤는데 한국어로 잘 정리된 자료는 찾지 못했고, 외국 형님이 쓴 [좋은 문서](https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-react-app-with-nodejs-bc06fa1c18f3)를 발견했다.

항상 새로운 걸 배우면 프로젝트 구조나 코드 스타일을 찾아보는게 꽤 오랜시간이 드는것같다.

<br/><br/>

# React + NodeJS

React에서 NodeJS로 서버를 사용한는 법은 실제 서비스를 할 때와 개발을 할 때가 다르다. 

실제 서비스를 할 때에는 React를 build한 후 나오는 파일을 NodeJS에 포함시키지만, 개발 단계에서는 계속 build하는게 비효율적이므로 React와 Server를 둘다 띄워두고 Proxy 서버를 통해 통신하는 방식으로 사용한다.

먼저, React(client)에서

```shell
npm install http-proxy-middleware --save
```

로 설치를 해준 뒤, src폴더에 setProxy.js파일을 만들고

```javascript
const proxy = require('http-proxy-middleware');

module.exports = (app) =>{
	app.use(
		proxy('/api', {
			target: 'http://localhost:3001' //서버 port입력
		})
	)
}
```

이렇게 입력해주면 된다.

이제 localhost:[react port]/api/로 가는 요청은 http://localhost:3001 로 갈거다. 

그러나 요청을 보내보면 보안상의 이유로 client side에서 아래처럼 오류가 날거다.

![화면 캡처 2021-04-22 162832](/assets/images/화면 캡처 2021-04-22 162832.png)

cors를 사용함으로써 이를 해결할 수 있다. server디렉토리에서

```shell
npm install cors --save
```

로 설치한 후, server.js에

```javascript
const cors = require('cors');

app.use(cors());
```

와 같이 설정하면 된다.

이제 fetch API나 axios같은걸 사용하면 서버에서 데이터를 받아올 수 있다.

<br/><br/>

# React 프로젝트 구조

create-react-app 명령어를 사용하면 기본적인 프로젝트 구조를 짜주므로 크게 고민할건 없다.

내가 궁금했던건 컴포넌트를 얼마나 잘게 잘라야 하는지. css나 js파일을 어떻게 관리하는지 정도였다.

물론 여기에 정답은 없겠지만 유지 보수를 위해 현업에서 자주 쓰는 방법은 있을 것 같았다.

구글링해서 찾아본 결과 일단 컴포넌트는 함수나 객체처럼 단일 책임 원칙(하나는 하나씩 일만 한다.)을 지켜서 만들면 된다. 말로 설명하는 것보다는 직접 컴포넌트를 만들어서 State와 Props를 다뤄보면 어떻게 분리해야 되는지 감이 조금씩 잡힌다.

css나 js파일은 src폴더에서 관리하는데, Component도 js파일이므로 여기서 관리한다. Component를 다 분리해서 만들어보면 알겠지만, 파일수가 엄청나게 많아진다. 

css나 js파일도 컴포넌트에 적용되는 단위로 나눠서 만들어야 유지 보수가 쉽다. 이 때, css, js파일을 분리한다고 해서 실제로 분리돼서 적용되진 않는다. 

react를 실행할 때, 모든 css, js파일이 한번에 적용되므로 네이밍을 굉장히 신경써서 해야한다. 나도 css가 중복적용돼서 굉장히 애를 먹었었다. css를 중복되지 않게하는 좋은 방법은 Component별로 최상의 태그에 특별한 이름의 class를 줘서 구분하는 것이다.

구글링 했을 때, 위와 같은 것들을 고려한 디렉토리를 구성하는 좋은방법을 찾았는데 바로 아래와 같이 구성하는 것이다.

![KakaoTalk_20210422_170253978](/assets/images/KakaoTalk_20210422_170253978.jpg)

Component이름의 폴더를 만들고 거기에 관련된 Component파일, css파일, js파일을 넣어 관리하는 것인데, 유지 보수에 괸장히 좋을 것 같다.

나는 조금 다른 방법으로 구성했는데, src에 Component폴더, css폴더, js폴더를 따로 두고 naming을 맞춰서 보관했다. 아래처럼.

![화면 캡처 2021-04-22 170404](/assets/images/화면 캡처 2021-04-22 170404.png)

처음 설명한 방법이 더 좋은것 같긴 하지만 이 방법도 유지보수가 어렵진 않아서 일단 냅뒀다. 분명 나중에 복잡해질 것 같긴 하니 (안 귀찮을때) 고쳐야겠다.

<br/><br/>

# 함수형 컴포넌트 vs 클래스 컴포넌트

사실 나는 업계 상황이나 뭐가 유행하는지 정확히 알지 못하지만, 나름 찾아본 바에 의하면 요즘은 새로 만드는 프로젝트는 함수형 컴포넌트와 Hook을 사용하길 권장하는것 같다. 

나는 일단은 클래스 컴포넌트로 공부를 시작했기 때문에 클래스 컴포넌트로 만들다가 함수형으로 교체할 생각이다. 이제 클래스형은 어느정도 익숙해졌다.

사실 React 공식문서를 보면 클래스형 컴포넌트를 굳이 함수형 컴포넌트로 바꾸는 것은 권장되지 않는다. 다만 새로 만드는 컴포넌트는 함수형으로 만들라고 권장할 뿐이다. 여담으로 페이스북의 React Component들도 전부 클래스형으로 남아있다고 한다.

물론 나는 공부하는 입장이기 때문에 굳이 클래스 컴포넌트를 함수형 컴포넌트로 바꿀 것이다.

<br/><br/>

# 끝

사실 프로젝트가 어느정도 진행된 후에 쓴느 글이지만 아직 React자체를 쓴지가 얼마 되지 않았기 때문에 헷갈리는게 많다. 더 열심히 해야겠다.



