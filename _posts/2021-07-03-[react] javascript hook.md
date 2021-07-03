---
layout: post
category: Front-end
thumbnail: react.png
tags: [react, javscript, closure]
typora-copy-images-to: ..\assets\images
typora-root-url: ..
---

얼마전에 react hook을 공부하는데 이해가 안되는 부분이 있었다.

```react
import React, { useEffect, useState, useRef } from "react";

const useClick = (onClick) => {
  if (typeof onClick !== "function") return;

  const element = useRef();
  useEffect(() => {
    if (element.current) element.current.addEventListener("click", onClick);
    return () => {
      if (element.current) element.current.removeEventListener("click", onClick);
    };
  }, []);
  return element;
};

const App = () => {
  const sayHello = () => console.log("say hello");
  const title = useClick(sayHello);

  return (
    <div className="App">
      <div>Hello</div>
      <h1 ref={title}> Hi </h1>
    </div>
  );
};

export default App;

```

그냥 element를 클릭하면 log를 띄워주는 간단한 hook이었다.

useClick에서 return 받은 ref로 element를 선택하고 useEffect에서 그 element에 이벤트를 등록해준다.

이 과정에서 "useEffect는 useClick이라는 함수에서 호출됐고, useClick함수는 element를 return할 때 종료될텐데 useEffect가 호출될 때 element변수가 뭘 카르키는지 어떻게 알지?" 라는 궁금증이 생겼다.

더 신기한 것은 useClick을 여러번 호출해서 여러 element에 넣어줘도 모두 click event가 잘 들어갔다.

그렇다면 useClick의 useEffect는 어떻게 element를 기억하고 있는걸까?

그 답은 javascript의 클로저(closure)에서 찾았다.

# 클로저

그동안 나름 javascript로 react 프로젝트도 해보고 express로 서버도 만들어 봤는데 클로저에 대해 몰랐던건 부끄러운 일인것 같다.

사실 클로저라는 개념에 대해 들어본 적은 있지만, 전에 들었을 때는 왜 쓰는지도 이해가 안되고 말을 들어도 무슨 뜻인지 몰라서 그냥 넘겼었다. 이번 기회에 클로저에 대해 확실히 알고 넘어가야겠다.

## Lexical scoping

```javascript
const Hello = () => {
  let greeting = "Hello";
  const sayHello = () => console.log(greeting);
  sayHello();
};
Hello();
```

위 코드를 실행하면 console에 hello가 출력된다.

이 코드에서 sayHello함수는 greeting이라는 변수를 가지고 있지 않지만 이를 출력할 수 있다. 함수가 중첩된 상황에서 내부함수는 외부함수의 변수에 접근할 수 있기 때문이다.

Lexical scoping이란 함수 선언 위치에 따라 상위 스코프를 결정하는 것이다. javascript는 Lexical scoping을 따르는데, 이에 따라 중첨된 함수는 외부 스코프에서 선언한 변수에 접근할 수 있다.

## 클로저

```javascript
const Hello = () => {
  let greeting = "Hello";
  const sayHello = () => console.log(greeting);
  return sayHello;
};

let myFunc = Hello();
myFunc();
```

위 코드도 실행 결과로 Hello가 출력된다. 내가 그동안 써본 다른 프로그래밍 언어들을 생각하면 위 코드는 greeting변수가 Hello함수가 return되면 접근이 불가능 해지므로 이 코드가 동작하는게 이해가 안된다.

그러나 javascript에서는 중첩된 함수의 내부함수는 클로저라는 것을 형성한다. 클로저는 자신이 생성된 시점의 유효 범위 내 모든 지역 변수로 구성된다. <strong>즉, 내부함수는 자신이 접근할 수 있었던 변수들을 기억하고 있는 것이다.</strong>

(추가로 보통 클로저를 사용할 때 return해서 사용을 많이 하지만 꼭 return을 해야 클로저가 생성되는 것은 아니다.)

따라서 위의 코드를 실행하면 myFunc에는 sayHello와 그의 클로저가 형성되고 myFunc함수를 호출해도 greeting변수를 사용할 수 있는 것이다.

# 결론

다시 처음의 문제로 돌아와보자.

```react
const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) element.current.addEventListener("click", onClick);
    return () => {
      if (element.current) element.current.removeEventListener("click", onClick);
    };
  }, []);
  return element;
};

const App = () => {
  const sayHello = () => console.log("say hello");
  const title = useClick(sayHello);

  return (
    <div className="App">
      <div>Hello</div>
      <h1 ref={title}> Hi </h1>
    </div>
  );
};

```

이 예에서 useEffect의 인자로 들어간 함수는 클로저를 형성한다. 자신이 접근할 수 있는 element 변수를 기억하고 있는 것이다. 따라서 useEffect가 실행될 때 element에 알맞게 event를 등록 해줄수 있고 useClick을 여러번 호출하도 각자 자신의 element를 기억하고 있기 때문에 각 요소에 알맞게 event가 등록되는 것이다.

# 끝

클로저 개념은 리액트 hook의 핵심 개념이다. 꼭 알고 가야하는 개념인 것이다. 다행히도 내가 전에 이걸 왜 넘겼지 싶을 정도로 개념이 어렵진 않았다.

그래도 처음에는 꽤 혼란을 주는 개념이기 때문에 제대로 공부하고 넘어가자.

react class컴포넌트의 복잡한 this 개념을 피하기 위해 function컴포넌트가 등장했는데, 결국 클로저 개념을 배워야해서 this 개념을 배우는거랑 다를게 없다는 말도 있다.

![closure](/assets/images/closure.png)

어떤 개발자가 남긴 트윗인데 너무.. 재밌다..ㅋㅋㅋㅋㅋㅋ
