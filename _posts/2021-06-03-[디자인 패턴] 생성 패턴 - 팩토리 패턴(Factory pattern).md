---
layout: post
category: 디자인 패턴
thumbnail: design.png
tags: [desing pattern]
typora-copy-images-to: ..\assets\images
typora-root-url: ..
---

# 디자인 패턴 - 생성패턴

## 추상 팩토리(Abstract Factory)

<br/>

<br/>

### 사용이유

추상 팩토리를 적용하면 클라이언트에서는 인터페이스를 통해 제품을 공급받으므로, 실제 객체가 무엇인지 정확히 몰라도 객체를 생성, 조작할 수 있다. 또한 새로운 객체를 추가할 때에도 기존 객체를 사용하는 코드를 변경시키지 않고 생성할 수 있다.

<br/>

<br/>

### 예제 ([refactoring.guru](https://refactoring.guru/design-patterns/abstract-factory)의 예제를 해석, 변형하여 사용했습니다.)

만약 가구 가게를 차리려 하면 상품의 종류, 상품의 형태로 상품들을 나눌 수 있다.

예를 들면

- 상품의 종류: 의자, 소파
- 상품의 형태: 모던한 형태, 클래식한 형태

이런식으로 말이다. 고객이 주문한 상품과 다른 상품을 보내면 안되므로 각각의 가구에 대한 object를 만들어야 한다.

만약 새로운 종류의 상품이나 상품의 새로운 형태를 추가하려 할 때, 기존의 코드를 수정해야 하는 상황은 아무도 원하지 않을 것이다.

이를 해결하기 위한 것이 추상 팩토리(Abstract Factory)이다.

추상 팩토리가 제시하는 방법은, 

1. 각 상품의 종류에 대한 인터페이스를 생성한 후, 이 인터페이스에 따라 모든 형태의 상품을 만든다.

```java
public class ModernChair implements Chair(){
    public ModernChair(){
        System.out.println("create modern chair");
    }
}

public class ClassicChair implements Chair(){
    public ClassicChair(){
        System.out.println("create classic chair");
    }
}

public interface Chair(){}
```



```java
public class ModernSofa implements Sofa(){
    public ModernSofa(){
        System.out.println("create modern sofa");
    }
}

public class ClassicSofa implements Sofa(){
    public ClassicSofa(){
        System.out.println("create classic sofa");
    }
}

public interface Sofa(){}
```

<br/>

<br/>

2. 각 상품에 대한 생성 메소드를 가지는 인터페이스(이를 추상 팩토리라 부름)을 선언한다.

```java
public interface FurnitureFactory{
    public Chair createChair();
    public Sofa createSofa();
}
```

<br/>

<br/>

3. 추상 팩토리에 기반한 각 팩토리를 생성한다.

```java
public class ModernFactory implements FurnitureFactory(){
    public ModernChair createModernChair(){
        return new ModernChair();
    )
	public ModernSofa createModernSofa(){
        return new ModernSofa();
    }
}
    
public class ClassicFactory() implements FurnitureFactory{
    public ClassicChair createClassicChair(){
   	    return new ModernChair();
    )
    public ClassicSofa createClassicSofa(){
        return new ClassicSofa();
    }
}
```

<br/>

<br/>

4. 이제 클라이언트에서 인스턴스를 활용하면 된다.

```java
public class ClientFactory{
    private FurnitureFactory factory;
    
    public ClientFactory(FurnitureFactory factory) {
        this.factory = factory;
    }
    
    public void createChair(){
        factory.createChair();
    }
    public void createSofa(){
        factory.createSofa();
    }
}

public class Client {
    public static void main(String[] args){
        // ModernChair 생성
        ClientFactory client = new ClientFactory(new ModernFactory());
        client.createChair();
    }
}
```

<br/>

<br/>

구조를 도식화 해보면 아래와 같다.

![KakaoTalk_20210603_160417175](/assets/images/KakaoTalk_20210603_160417175.jpg)

### 효과

이렇게 작성하면 우리는 구체적인 클래스들(ClassicChair, ModernSofa등등)이 어떻게 구현되었는지는 알 필요가 없고 인터페이스(FurnitureFactory, Chair, Sofa)만 알면 가구를 생성해서 사용할 수 있다.

또한 Chair나 Sofa의 기능이 수정또는 확장되었을때, Client 코드는 딱히 수정할 필요가 없어진다.

상품의 종류나 형태가 추가되었을때에도 Client의 코드는 거의 수정이 필요하지 않다, 하지만 생성해야하는 클래스가 많아져서 코드가 난잡해질 수 있다.

# 끝

패턴 하나를 정리하는데에 생각보다 많은 시간이 걸렸다. 솔직히 처음에 추상 팩토리 사용이유도 딱히 이해가 안되고, 예제를 정리하면서도 헷갈려서 엄청 해맸다. 겨우 다 이해하고 글을 다 작성하고도 굳이 이렇게까지 해야하나..? 라는 생각이 들었다. 디자인 패턴은 협업에서 더 필요한것이기도 하고, 내가 객체지향 프로그래밍을 제대로 해본 경험이 없어서 그렇게 느낀것 같다. 그래도 미리 알아두면 나중에 필요할 때 잘 써먹을 수 있을 것이다.





