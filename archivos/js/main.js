'use strict';

/*
 *	Amé, Julián
 */


/**
 * Definiciones iniciales
 */

const d = document;
const main = d.querySelector('main');
let catalogo;
let minicarrito; /*= d.querySelector('#minicarrito');*/
let contadorItemsAgregados; /* = d.querySelector('#minicarrito :first-child span');*/
let acumuladorTotal; /* = d.querySelector('#minicarrito :nth-child(2) span');*/
let botonVerCarrito;
let agregoProductos = false;
let productosEnCarrito = [];
let cantidadesPorProductoEnCarrito = [];
let mostrandoCarrito;



/**
 * Funciones principales
 */

function armarMainSectionCatalogo() {
	mostrandoCarrito = false;

	//Primero me aseguro que esté vacío
	while (main.firstChild) {
		main.removeChild(main.lastChild);
	}

	let h2 = d.createElement('h2');
	h2.innerHTML = 'Productos';
	main.appendChild(h2);

	catalogo = d.createElement('div');
	catalogo.id = 'productos';
	main.appendChild(catalogo);

	//catalogo = d.querySelector('#productos');

	popularCatalogo();

	if (agregoProductos) {
		crearCarrito();
		actualizarCantidadDeProductosEnCarrito();
	}

}



window.onload = armarMainSectionCatalogo;


function popularCatalogo() {
	// Armo el catálogo de productos en el front
	for (let producto of aProductos) {

		let divproducto = d.createElement('div');
		divproducto.dataset.id = producto.id;

		let divImg = d.createElement('div');
		divImg.setAttribute('class', 'productImageContainer');

		let img = d.createElement('img');
		img.src = producto.imagen;
		img.alt = producto.nombre;
		img.dataset.id = producto.id;
		img.onclick = AbrirModal;
		divImg.appendChild(img);

		divproducto.appendChild(divImg);

		let div = d.createElement('div');
		let h3 = d.createElement('h3');
		h3.innerHTML = producto.nombre;
		h3.dataset.producto = producto.nombre;
		div.appendChild(h3);

		let p = d.createElement('p');
		p.innerHTML = `Precio: `;
		let span = d.createElement('span');
		span.innerHTML = `$${producto.precio}`;
		p.appendChild(span);
		div.appendChild(p);

		let botonAmpliar = d.createElement('button');
		botonAmpliar.innerHTML = 'Detalle';
		botonAmpliar.dataset.id = producto.id;
		botonAmpliar.onclick = AbrirModal;
		botonAmpliar.setAttribute('class', 'outline');
		div.appendChild(botonAmpliar);

		let botonAgregar = d.createElement('button');
		botonAgregar.innerHTML = 'Agregar';
		botonAgregar.dataset.id = producto.id;
		botonAgregar.dataset.precio = producto.precio;
		botonAgregar.addEventListener('click', AgregarACarrito);
		div.appendChild(botonAgregar);

		divproducto.appendChild(div);

		catalogo.appendChild(divproducto);

		//console.log(`appendchildié el producto:`);
		//console.log(divproducto);
	}
}







function crearCarrito() {
	minicarrito = d.createElement('div');
	minicarrito.id = 'minicarrito';

	let icon = d.createElement('i');
	icon.setAttribute('class', 'fas fa-shopping-cart');
	minicarrito.appendChild(icon);

	let pContadorItemsAgregados = d.createElement('p');
	pContadorItemsAgregados.innerHTML = ' items agregados';
	contadorItemsAgregados = d.createElement('span');
	contadorItemsAgregados.innerHTML = '0';
	pContadorItemsAgregados.prepend(contadorItemsAgregados);
	minicarrito.appendChild(pContadorItemsAgregados);

	let pAcumuladorTotal = d.createElement('p');
	pAcumuladorTotal.innerHTML = ' es el total';
	acumuladorTotal = d.createElement('span');
	acumuladorTotal.innerHTML = '0';
	pAcumuladorTotal.prepend(acumuladorTotal);
	pAcumuladorTotal.prepend('$');
	minicarrito.appendChild(pAcumuladorTotal);

	botonVerCarrito = d.createElement('button');
	//botonVerCarrito.id = 'botonVerCarrito';
	botonVerCarrito.innerHTML = 'Ver carrito';
	botonVerCarrito.addEventListener('click', toggleMostrarProductosEnCarrito);
	minicarrito.appendChild(botonVerCarrito);

	let botonComprar = d.createElement('button');
	//botonVerCarrito.id = 'botonVerCarrito';
	botonComprar.innerHTML = 'Comprar';
	botonComprar.addEventListener('click', accederACheckout);
	minicarrito.appendChild(botonComprar);


	main.prepend(minicarrito);

	let yposMicarrito = d.getElementById('minicarrito').offsetTop;
	let pos = window.pageYOffset;
	if (pos > yposMicarrito - 100) {
		let scrollAnim = setInterval(
			() => {
				pos -= 15;
				if (pos <= yposMicarrito - 100) {
					pos = yposMicarrito - 100;
					clearInterval(scrollAnim);
				}
				window.scrollTo(0, pos);
			},
			5
		);
	}

}


function AgregarACarrito() {
	//console.log('disparé');

	if (!agregoProductos) {
		crearCarrito();
		agregoProductos = true;
	}

	/*
	* Esto se desestima por haberse incluido en la función "actualizarCantidadDeProductosEnCarrito"
	// Cuando se actualizan los productos del minicarrito, actualizo los valores generales también
	
	contadorItemsAgregados.innerHTML = parseInt(contadorItemsAgregados.innerHTML) + 1;
	//console.log(this.dataset.precio);
	acumuladorTotal.innerHTML = parseInt(acumuladorTotal.innerHTML) + parseInt(this.dataset.precio);
	*/
	//Antes de pushear, hay que recorrer el array productos en carrito para saber si ya fue pusheado. En ese caso, hay que agregarle una unidad (en otro array).
	// ...Ver despues

	let indexOfProductoAAgregar = productosEnCarrito.indexOf(aProductos[aProductos.map(function (e) {
		return e.id;
	}).indexOf(parseInt(this.dataset.id))]);

	if (indexOfProductoAAgregar == -1) {
		// QUiere decir que no existía previamente en el carrito
		indexOfProductoAAgregar = productosEnCarrito.push(aProductos[aProductos.map(function (e) {
			return e.id;
		}).indexOf(parseInt(this.dataset.id))]) - 1;
		//console.log(productosEnCarrito);

		if (mostrandoCarrito) {
			//Si no existía el producto en el carrito, y se está mostrando, entonces actualizo el carrito
			actualizarProductosEnCarrito();
		}

	}

	//Ahora aumento su cantidad en el array de cantidades 
	if (typeof cantidadesPorProductoEnCarrito[indexOfProductoAAgregar] != 'number') {
		// Quiere decir qeu nunca hubo valor aquí
		cantidadesPorProductoEnCarrito[indexOfProductoAAgregar] = 1;
	} else {
		cantidadesPorProductoEnCarrito[indexOfProductoAAgregar]++;
	}
	console.log(cantidadesPorProductoEnCarrito);

	// Esto está medio sucio. Se llama dos veces esta funcion, cuando el producto es nuevo.
	actualizarCantidadDeProductosEnCarrito();

}

function AbrirModal() {

	let nombreDelProducto = aProductos[aProductos.map(function (e) {
		return e.id;
	}).indexOf(parseInt(this.dataset.id))].nombre;
	let srcImagen = aProductos[aProductos.map(function (e) {
		return e.id;
	}).indexOf(parseInt(this.dataset.id))].imagen;
	let precio = aProductos[aProductos.map(function (e) {
		return e.id;
	}).indexOf(parseInt(this.dataset.id))].precio;
	let descripcion = aProductos[aProductos.map(function (e) {
		return e.id;
	}).indexOf(parseInt(this.dataset.id))].descripcion;


	let div = d.createElement('div');
	div.id = 'modalProducto';
	div.setAttribute('class', 'modal');

	//No me gusta no poder seleccionar el texto. Luego lo pienso más.
	div.addEventListener('click', function (e) {
		if (e.path.length <= 5) {
			div.remove();
		}
		//console.log(e);
	}, true);


	let container = d.createElement('div');
	container.setAttribute('class', 'containerModal');

	let a = d.createElement('a');
	a.href = 'javascript:void(0)';
	a.addEventListener('click', function (e) {
		div.remove();
	});
	a.innerHTML = 'X';
	div.appendChild(a);

	let img = d.createElement('img');
	img.src = srcImagen;
	img.alt = nombreDelProducto;
	container.appendChild(img);

	let h3 = d.createElement('h3');
	h3.innerHTML = nombreDelProducto;
	container.appendChild(h3);

	let pPrecio = d.createElement('p');
	pPrecio.innerHTML = 'Precio ';

	let spanPrecio = d.createElement('span');
	spanPrecio.innerHTML = `$${precio}`;
	pPrecio.appendChild(spanPrecio);
	container.appendChild(pPrecio);

	let pDescripcion = d.createElement('p');
	pDescripcion.innerHTML = descripcion;
	container.appendChild(pDescripcion);

	let button = d.createElement('button');
	button.dataset.id = this.dataset.id;
	button.dataset.precio = precio;
	button.onclick = AgregarACarrito;
	button.innerHTML = 'Agregar';
	container.appendChild(button);

	div.appendChild(container);
	d.body.appendChild(div);

}


function toggleMostrarProductosEnCarrito() {

	//chequeo si ya se mostró el carrito, caso afirmativo no hago más nada.
	if (!mostrandoCarrito) {
		//Si no existe, lo creo
		actualizarProductosEnCarrito();
		mostrandoCarrito = true;

		actualizarCantidadDeProductosEnCarrito();
		botonVerCarrito.innerHTML = 'Ocultar carrito';

	} else {
		//Si existe, lo borro
		d.getElementById('listadoProductosEnCarrito').remove();
		d.getElementsByClassName('flexBreak')[0].remove();
		d.getElementById('botonEliminarTodo').remove();
		mostrandoCarrito = false;
		botonVerCarrito.innerHTML = 'Ver carrito';
	}



}

function actualizarProductosEnCarrito() {
	if (!productosEnCarrito.length) {
		// Si entro acá es porque se borraron todos los productos del carrito.
		// Debo eliminar la sección
		eliminarCarrito();

	} else if (mostrandoCarrito) {
		// Si entro acá es porque aún hay productos en carrito y esta sección está desplegada
		//Lo borro para rehacerlo
		d.getElementById('listadoProductosEnCarrito').remove();
		d.getElementsByClassName('flexBreak')[0].remove();
		d.getElementById('botonEliminarTodo').remove();
	}
	let flexBreak = d.createElement('div');
	flexBreak.setAttribute('class', 'flexBreak');
	minicarrito.appendChild(flexBreak);


	let divListado = d.createElement('div');
	divListado.id = 'listadoProductosEnCarrito';

	console.log(productosEnCarrito);

	for (let itemEnCarrito of productosEnCarrito) {
		console.log(itemEnCarrito);
		let divProducto = d.createElement('div');
		divProducto.dataset.id = itemEnCarrito.id;

		let imgProd = d.createElement('img');
		imgProd.src = itemEnCarrito.imagen;
		imgProd.alt = itemEnCarrito.nombre;
		imgProd.title = itemEnCarrito.nombre;
		imgProd.dataset.id = itemEnCarrito.id;
		imgProd.addEventListener('click', AbrirModal);
		divProducto.appendChild(imgProd);

		let p = d.createElement('p');
		divProducto.appendChild(p);

		let a = d.createElement('button');
		a.setAttribute('class', 'quitarProductoDeCarrito');
		a.addEventListener('click', function () {
			quitarDeCarrito(itemEnCarrito.id);
		});
		a.innerHTML = 'Quitar una unidad';
		divProducto.appendChild(a);

		divListado.appendChild(divProducto);
		minicarrito.appendChild(divListado);
	}
	if (productosEnCarrito.length) {
		// Si aún hay productos en carrito, entonces muestro el botón para eliminarlos
		minicarrito.appendChild(flexBreak);

		let botonEliminarTodo = d.createElement('button');
		//botonEliminarTodo.dataset.idProducto = itemEnCarrito.id;
		botonEliminarTodo.addEventListener('click', vaciarCarrito);
		botonEliminarTodo.id = 'botonEliminarTodo';
		botonEliminarTodo.innerHTML = 'Vaciar carrito';
		minicarrito.appendChild(botonEliminarTodo);
	}


}

function actualizarCantidadDeProductosEnCarrito() {

	let cantidadTotalProductosEnCarrito = 0;
	let valorTotalProductosEnCarrito = 0;


	// Tengo que recorrer el array de productos y cargar por cada posición, la cantidad del array de cantidades, en el innerHTML del parrafo del div con su ID
	for (let itemEnCarrito in productosEnCarrito) {

		cantidadTotalProductosEnCarrito += cantidadesPorProductoEnCarrito[itemEnCarrito];
		valorTotalProductosEnCarrito += productosEnCarrito[itemEnCarrito].precio * cantidadesPorProductoEnCarrito[itemEnCarrito];

		if (mostrandoCarrito) {
			let p = d.querySelector(`[data-id="${productosEnCarrito[itemEnCarrito].id}"]`).getElementsByTagName('p');

			//Primero lo vacío, para no hacer quilombo
			while (p[0].firstChild) {
				p[0].removeChild(p[0].lastChild);
			}

			//p[0].dataset.id = productosEnCarrito[itemEnCarrito].id;
			//p[0].addEventListener('click', AbrirModal);
			p[0].appendChild(d.createElement('strong'));
			p[0].firstChild.innerHTML = productosEnCarrito[itemEnCarrito].nombre;
			p[0].appendChild(d.createElement('br'));
			p[0].innerHTML += cantidadesPorProductoEnCarrito[itemEnCarrito] + ' unidad';
			p[0].innerHTML += cantidadesPorProductoEnCarrito[itemEnCarrito] > 1 ? 'es' : '';

			p[0].innerHTML += ' en carrito';
			p[0].appendChild(d.createElement('br'));
			p[0].innerHTML += `Subtotal: $${productosEnCarrito[itemEnCarrito].precio * cantidadesPorProductoEnCarrito[itemEnCarrito]}`;

		}
	}

	if (agregoProductos) {
		// Actualizo acá también la cantidad de items total y el precio total
		contadorItemsAgregados.innerHTML = cantidadTotalProductosEnCarrito;
		acumuladorTotal.innerHTML = valorTotalProductosEnCarrito;
	}
}


function quitarDeCarrito(idProducto,
	vaciar = false) {
	// Elimina un producto del carrito, el correspondiente al clickeado.
	// Elimina de a una unidad. Si el array de cantidad es 0, entonces popea de ambos arrays
	// En caso de que se solicite vaciar, limpia los arrays y recarga el carrito

	if (vaciar) {
		//
		cantidadesPorProductoEnCarrito = [];
		productosEnCarrito = [];
		actualizarProductosEnCarrito();
	} else {
		//Tengo que recorrer el array de productos en carritos, buscar el que tenga este ID. Tomar el índice para restar uno en la posición del array de cantidades
		let indiceDelProducto = productosEnCarrito.map(function (e) {
			return e.id;
		}).indexOf(parseInt(idProducto));

		if (cantidadesPorProductoEnCarrito[indiceDelProducto]) {
			cantidadesPorProductoEnCarrito[indiceDelProducto]--;
			if (cantidadesPorProductoEnCarrito[indiceDelProducto] == 0) {
				// Este producto no cuenta con más unidades en el carrito. Lo borro del array y refresheo la lista de productos
				let deleted = cantidadesPorProductoEnCarrito.splice(indiceDelProducto, 1);
				console.warn('se eliminó el obj: ' + deleted + ' de la posición ' + indiceDelProducto);
				deleted = productosEnCarrito.splice(indiceDelProducto, 1);
				console.warn('se eliminó el obj: ' + deleted + ' de la posición ' + indiceDelProducto);
				actualizarProductosEnCarrito();
			}
		} else {
			console.error('Error. Cantidad es: ' + cantidadesPorProductoEnCarrito[indiceDelProducto] + ' No puedo restar a cantidades negativas');
		}
	}
	actualizarCantidadDeProductosEnCarrito();
}


function vaciarCarrito() {
	quitarDeCarrito(0, true);
}


function eliminarCarrito() {
	mostrandoCarrito = false;
	minicarrito.remove();
	agregoProductos = false;
}




function accederACheckout() {
	// Vacío el main, y armo el contenido de la instancia de checkout.
	while (main.firstChild) {
		main.removeChild(main.lastChild);
	}

	let formularioCheckout = d.createElement('form');
	let fieldset = d.createElement('fieldset');
	let legend = d.createElement('legend');
	legend.innerHTML = 'Información del usuario';
	fieldset.appendChild(legend);



	let label = d.createElement('label');
	label.htmlFor = 'formNombre';
	label.innerHTML = 'Nombre';
	fieldset.appendChild(label);
	let input = d.createElement('input');
	input.id = 'formNombre';
	input.type = 'text';
	input.name = 'formNombre';
	fieldset.appendChild(input);

	label = d.createElement('label');
	label.htmlFor = 'formTelefono';
	label.innerHTML = 'Telefono';
	fieldset.appendChild(label);
	input = d.createElement('input');
	input.id = 'formTelefono';
	input.name = 'formTelefono';
	input.type = 'number';
	fieldset.appendChild(input);

	label = d.createElement('label');
	label.htmlFor = 'formEmail';
	label.innerHTML = 'E-mail';
	fieldset.appendChild(label);
	input = d.createElement('input');
	input.id = 'formEmail';
	input.name = 'formEmail';
	input.type = 'email';
	fieldset.appendChild(input);

	label = d.createElement('label');
	label.htmlFor = 'formLugarEntrega';
	label.innerHTML = 'Dirección de entrega';
	fieldset.appendChild(label);
	input = d.createElement('input');
	input.id = 'formLugarEntrega';
	input.name = 'formLugarEntrega';
	input.type = 'text';
	fieldset.appendChild(input);

	label = d.createElement('label');
	label.htmlFor = 'formFechaEntrega';
	label.innerHTML = 'Fecha de entrega solicitada';
	fieldset.appendChild(label);
	input = d.createElement('input');
	input.id = 'formFechaEntrega';
	input.name = 'formFechaEntrega';
	input.type = 'date';
	fieldset.appendChild(input);


	formularioCheckout.appendChild(fieldset);



	fieldset = d.createElement('fieldset');
	legend = d.createElement('legend');
	legend.innerHTML = 'Información del pago';
	fieldset.appendChild(legend);

	label = d.createElement('label');
	label.htmlFor = 'formMetodoDePago';
	label.innerHTML = 'Método de pago';
	fieldset.appendChild(label);
	let select = d.createElement('select');
	select.id = 'formMetodoDePago';
	select.name = 'formMetodoDePago';

	/*
	* Tengo que agregarle una función que se llame cada vez que cambia el valor del select,
	* para detectar si el selector de cuotas va enabled o disabled
	*/

	let option = d.createElement('option');
	option.value = 'mercadopago';
	option.innerHTML = 'Mercadopago';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = 'credito';
	option.innerHTML = 'Tarjeta de crédito';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = 'debito';
	option.innerHTML = 'Tarjeta de débito';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = 'rapipago';
	option.innerHTML = 'RapiPago';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = 'payu';
	option.innerHTML = 'PayU';
	select.appendChild(option);

	fieldset.appendChild(select);


	label = d.createElement('label');
	label.htmlFor = 'formCuotas';
	label.innerHTML = 'Cuotas';
	fieldset.appendChild(label);
	select = d.createElement('select');
	select.id = 'formCuotas';
	select.name = 'formCuotas';

	option = d.createElement('option');
	option.value = '1';
	option.innerHTML = '1 cuota';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = '3';
	option.innerHTML = '3 cuotas';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = '6';
	option.innerHTML = '6 cuotas';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = '12';
	option.innerHTML = '12 cuotas';
	select.appendChild(option);

	option = d.createElement('option');
	option.value = '18';
	option.innerHTML = '18 cuotas';
	select.appendChild(option);

	fieldset.appendChild(select);

	formularioCheckout.appendChild(fieldset);


	let botonVolver = d.createElement('button');
	botonVolver.innerHTML = 'Volver al catálogo';
	botonVolver.addEventListener('click', armarMainSectionCatalogo);

	formularioCheckout.appendChild(botonVolver);

	let botonFinalizarCompra = d.createElement('button');
	botonFinalizarCompra.type = 'submit';
	botonFinalizarCompra.innerHTML = 'Finalizar Compra';
	//botonFinalizarCompra.addEventListener('click', armarMainSectionCatalogo);

	formularioCheckout.appendChild(botonFinalizarCompra);
	

	/**
	 * 
	 * Agregar un preview de productos y valor total
	 * 
	 * 
	 */


	main.appendChild(formularioCheckout);
}