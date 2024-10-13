import './App.css';
import { useState, useEffect } from "react";
//Axios para envio de datos 
import Axios from "axios";
//boostrap
import 'bootstrap/dist/css/bootstrap.min.css';

//sweetalert2
import Swal from 'sweetalert2'


function App() {
  const [nombre, setNombre] =  useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] =  useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false);

  const [empleadosList, setEmpleados] = useState([]);

  //envío de datos con Axios
  //Agregar usuario
  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados(); // Actualiza la lista de empleados después de agregar uno
      limpiarCampos();
      //notificacion sweet2
      Swal.fire({
        title: "Registro Exitoso",
        text: "Excelente, el empleado "+nombre+ "esta registrado",
        icon: "success",
        timer:3000
      });
      
    }).catch(function(error){ //mensaje de error en caso de haber uno
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se logro ingresar el empleado!",
        footer: JSON.parse(JSON.stringify(error)).message==="Network error"?"Error de Servidor /intente mas tarde":JSON.parse(JSON.stringify(error)).message
        //el JSON que se aqui encapsula el mensjae de error y lo muestra 
        // esto esta condicionado con un condicional ternario
      });
    });
  }

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Actualizar datos dentro del crud
  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      //notificacion sweet2
      Swal.fire({
        title: "Actualización Exitosa",
        text: "Excelente, el empleado "+nombre+ "fue actualizado con exito",
        icon: "success",
        timer:3000
      }).catch(function(error){ //mensaje de error en caso de haber uno
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se logro actualizar el empleado!",
          footer: JSON.parse(JSON.stringify(error)).message==="Network error"?"Error de Servidor /intente mas tarde":JSON.parse(JSON.stringify(error)).message
          //el JSON que se aqui encapsula el mensjae de error y lo muestra 
          // esto esta condicionado con un condicional ternario
        });
      });
    });
  }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//ELIMINAR empleado de CRUD
const deleteEmple = (val) => {
  //notificacion sweet2
  //primero es la notificacion para luego confirmar la eliminacion
  Swal.fire({
    title: "Confirmar eliminado",
    text: "¿Realmente desea eliminar a "+val.nombre+"?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminarlo!"
  }).then((result) => {
    if (result.isConfirmed) {
      Axios.delete(`http://localhost:3001/delete/${val.id}`, {
      }).then(() => {
        getEmpleados();
        limpiarCampos();
        //esto va aca ya que es despues de haber eliminado como tal
        Swal.fire({
          title: "Eliminado",
          text: "El empleado"+nombre+ "fue eliminado con exito",
          icon: "success",
          timer:2000 
        });
      }).catch(function(error){ //mensaje de error en caso de haber uno
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se logro eliminar el empleado!",
          footer: JSON.parse(JSON.stringify(error)).message==="Network error"?"Error de Servidor /intente mas tarde":JSON.parse(JSON.stringify(error)).message
          //el JSON que se aqui encapsula el mensjae de error y lo muestra 
          // esto esta condicionado con un condicional ternario
        });
      });
    }
  });

}

//Seteos de datos en el formulario y la tabla de datos acumulados

// envio de datos al formulario para editarlos  
  const editarEmpleado = (val)=>{
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAnios(val.anios);
    setId(val.id);
  }

  //
  const limpiarCampos = ()=>{
    setId("");
    setNombre("");
    setCargo("");
    setEdad("");
    setPais("");
    setAnios("");
    //devolver el boton de registrar
    setEditar(false);
  }

  // Pedido de datos
  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data); // Actualiza la lista de empleados
    });
  }

  // Ejecuta `getEmpleados` solo cuando el componente se monta
  useEffect(() => {
    getEmpleados();
  }, []); 

  return (
    ///Formulario///
    <div className="container">
      {/* Tarjeta de Bootstrap */}
      <div className="card text-center">
        <div className="card-header">
          Gestión de Empleados
        </div>
        <div className="card-body">
          {/* Cuerpo de la tarjeta */}
          <div className="datos">
            {/*Nombre*/}
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Nombre:</span>
              <input type="text" 
                onChange={(event) => setNombre(event.target.value)}
              className="form-control" value={nombre} placeholder="Ingrese el Nombre" aria-label="Username" aria-describedby="basic-addon1"  
              />
            </div>
            {/*Edad*/}
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Edad:</span>
              <input type="number" 
                onChange={(event) => setEdad(Number(event.target.value))}
                className="form-control" value={edad} placeholder="Ingrese la Edad" aria-label="Username" aria-describedby="basic-addon1"  
              />
            </div>
            {/*Pais*/}
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Pais:</span>
              <input type="text" 
               onChange={(event) => setPais(event.target.value)}
               className="form-control" value={pais} placeholder="Ingrese el Pais" aria-label="Username" aria-describedby="basic-addon1"  
              />
            </div>
            {/*Cargo*/}
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Cargo:</span>
              <input type="text" 
               onChange={(event) => setCargo(event.target.value)}
               className="form-control" value={cargo} placeholder="Ingrese el Cargo" aria-label="Username" aria-describedby="basic-addon1"  
              />
            </div>
            {/*Años*/}
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Años:</span>
              <input type="number" 
                onChange={(event) => setAnios(Number(event.target.value))}
                className="form-control" value={anios}  placeholder="Ingrese los Años" aria-label="Username" aria-describedby="basic-addon1"  
              />
            </div>
          </div>
          <div className="card-footer text-muted">
            {/* Pie de la tarjeta */}
              {
                editar?
                <div>
                  <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                  <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
                </div>
                : 
                <button className='btn btn-success' onClick={add}>Registrar</button>
              }
          </div>
        </div>
      </div>
      {/* Tabla de empleados */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">Pais</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        {/*Cuerpo o listado de la tabla*/}
        <tbody>
           {
          empleadosList.map((val, key) => {
            return <tr key={val.id}>
              <th>{val.id}</th>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.anios}</td>
              <td> {/*Botones*/}
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button"
                  onClick={()=>{
                    editarEmpleado(val); //usamos val en ve de event ya que val ya tuene los valores tomados
                  }}
                  className="btn btn-info">Editar</button>
                  <button type="button" onClick={()=>{
                    deleteEmple(val);
                  }}className="btn btn-danger">Eliminar</button>
                </div>
              </td>
            </tr> 
          })
        }
        </tbody> 
      </table>
    </div>
  );
}

export default App;

