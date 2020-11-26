import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const pedido = document.querySelector('.listado-pedido');

if(pedido){
    pedido.addEventListener('click', e =>{
        //console.log(e.target.classList);
        if(e.target.classList.contains('fa-check-circle')){
           // console.log('actualizando');
            const icono = e.target;
            const idPedido = icono.parentElement.dataset.pedidos;
            console.log(idPedido)
            const url = `${location.origin}/ListaPedidos/${idPedido}`;
            console.log(url)
           // console.log(url);
           axios.patch(url, { idPedido })
           .then(function(respuesta){
              // console.log(respuesta);
              if(respuesta.status===200){
                  icono.classList.toggle('completo');
                  actualizarAvance();
              }
           })
        }
        if(e.target.classList.contains('fa-trash')){
            console.log('Eliminando...');
            const pedidoHTML = e.target.parentElement,
            idPedido = pedidoHTML.dataset.pedidos;
            //console.log(tareaHTML);
            //console.log(idTarea);
            Swal.fire({
                title: '¿Estas seguro Eliminar el pedido?',
                text: "Si se elimina, se pierde el pedido",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si',
                cancelButtonText: 'Cancelar!'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/ListaPedidos/${idPedido}`;
                    axios.delete(url, {params:{idPedido}})
                    .then(function(respuesta){
                        //console.log(respuesta);
                        if(respuesta.status===200){
                            pedidoHTML.parentElement.removeChild(pedidoHTML);

                            //opcional
                            Swal.fire(
                                'Pedido eliminado',
                                respuesta.data,
                                'success'
                            )
                            actualizarAvance();
                        }
                    })
                }
            })
        }
    })
}

export default pedido;