import Swal from 'sweetalert2';

export const actualizarAvance = ()=>{
    //Seleccionar Tareas (todas)
    const pedidos = document.querySelectorAll('.contenedor-recorrido');

    if(pedidos.length){
        //Seleccionar facturas completadas
        const pedidosHechos = document.querySelectorAll('.completo');
        //calcular el avance
        const avance = Math.round((pedidosHechos.length/pedidos.length)*100);
        //rellenar barra
        const porcentaje = document.querySelector('#porcentaje');

        porcentaje.style.width = avance + '%';

        if(avance == 100){
            Swal.fire(
                'pedidos al dia',
                'success'
            )
        }

    }
}