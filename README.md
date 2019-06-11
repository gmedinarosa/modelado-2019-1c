# Graficador de Sistemas Autónomos 1D
El objetivo del programa es poder ingresar una ecuación que describa un sistema
autónomo 1D y ver cómo se mueve la función dependiendo del punto inicial.

Para ello el programa muestra dos gráficos: el de la función en sí misma, y un 
gráfico de vectores que representan la tangente de la función aproximada en 
cada punto. Puede, también, tocar sobre cualquier punto de este ultimo gráfico
para ver cómo se vería la función teniendo a ese punto como el inicial.

Además, el programa permite modificar el número mínimo y máximo a mostrar de 
cada eje.

El método utilizado para la aproximación es el método de Euler. Utilizamos un
valor de `h` inicial de 0.01, pero el programa permite modificarlo al valor que
se desee.

Puede probar esta aplicación haciendo click [aquí](https://modelado-2019-1c.herokuapp.com/).

![Screenshot](http://g.recordit.co/p1s3grdeRU.gif)

## Implementación del Método de Euler
El código de la implementación es el siguiente:
```javascript
// Definimos una función fnXb que toma como parámetros a un X inicial (Xa), un
// T inicial (Ta) y el h del método de Euler
// En este contexto fn es la ecuación que describe al sistema
// El equivalente matemático sería: Fn(x,t,h) = x + Fn(x, t) * h
const fnXb = (Xa, Ta, h) => Xa + fn(Xa, Ta) * h

// Obtenemos el punto que le sigue al inicial
let Tb = Ta + h
let Xb = fnXb(Xa, Ta, h)

// Ignoramos resultados imaginarios o inválidos
if (typeof Xb === 'undefined' || typeof Xb === 'object' || isNaN(Xb)) return null

// Componemos el vector con la diferencia entre el primer punto y el obtenido
const vector = {a: Tb - Ta, b: Xb - Xa}
```
Este código se utiliza en dos lugares: 
1. Para calcular las direcciones de las flechas en el gráfico de vectores 
(donde la implementación es idéntica a la de arriba, y toma valores de `x` y 
`t` a intervalos regulares)
2. Para graficar la función cuando se selecciona un punto del gráfico (aquí se
envuelve el código en un ciclo `for loop` para obtener todos los valores que
entren en el gráfico en todo el eje x)

El código del 1 se encuentra en el archivo [Xvst.js](./src/graphers/Xvst.js)

El del 2 se encuentra en [Approx.js](./src/graphers/Approx.js)

## Autores
- Gonzalo Medina Rosa
- Nicolás Rabellino
- Matías Reines
