---
layout: post
category: 디자인 패턴
thumbnail: design.png
tags: [desing pattern]

---

# 디자인 패턴 - 생성패턴

## 팩토리 메소드 패턴(Factory Method Pattern)

<br/>

<br/>

### 사용이유

팩토리 메소드 패턴은 객체의 생성을 서브 클래스에 위임하는 패턴이다.

만약 우리가 신발을 판매하는 앱을 출시했다고 생각해보자. 우리의 앱은 상품으로 신발만 취급할 것이고, Shoes클래스에 많은 코드가 들어가 있을 것이다.

그런데 앱이 점점 잘 되면서 우리는 상의도 팔고 하의도 팔고 싶어졌다. 그러나 현재 우리 코드의 대부분이 Shoe클래스와 엮여있을테니 우리가 Top, Pants클래스를 생성하려면 코드를 대부분 수정해야 할 것이다.

<br/>

<br/>



### 예제

위와같은 문제를 해결하기 위한 코드를 작성해보자. 

1. 상품에 대한 추상 클래스와, 클래스를 만든다.

```java
public abstract class Product {
	public abstract void printProduct();
}

public class Shoes extends Product {
	public void printProduct(){
        System.out.Println("these are shoes");
    }
}
```

2. 입력받은 값에 따라 상품을 반환하는 팩토리 클래스를 정의한다. 

```java
public abstract class ProductFactory{
    abstract Product getProduct(String product);
}

public class ProductFactory extends ProductFactory {
	public Product getProduct(String product){
        switch(product){
            case 'shoes':
                return new Shoes();
        }
        return null;
    }
}
```

3. 생성하고싶은 상품을 Factory클래스의 getProduct메소드를 통해 생성한다.

```java
public class MyApp{
    public static void main(String[] args){
        ProductFactory productFactory = new ProductFactory();
        Product product1 = productFactory.getProduct("shoes");
        product1.printProduct();
    }
}
```

<br/>

<br/>

이제 이렇게 구현을 했다면 새로운 상품을 추가할 때는 상품의 클래스를 만들고 팩토리 클래스에 추가만 하면 된다.

```java
//새 상품 추가
public class Top extends Product {
	public void printProduct(){
        System.out.Println("this is top");
    }
}

public class Pants extends Product {
	public void printProduct(){
        System.out.Println("this is pants");
    }
}
```

```java
// 팩토리 클래스 수정
public class ProductFactory extends ProductFactory {
	public Product getProduct(String product){
        switch(product){
            case 'shoes':
                return new Shoes();
            case 'top':
                return new Top();
            case 'pants':
                return new Pants();
        }
        return null;
    }
}
```

이렇게만 수정하면 client에서 기존 코드 수정없이 사용할 수 있다.

```java
public class MyApp{
    public static void main(String[] args){
        ProductFactory productFactory = new ProductFactory();
        
        Product product1 = productFactory.getProduct("shoes");
        product1.printProduct();
        
        Product productTop = productFactory.getProduct("top");
        product1.printProduct();
        
        Product productPants = productFactory.getProduct("pants");
        product1.printProduct();
    }
}
```



<br/>

<br/>

#  끝



