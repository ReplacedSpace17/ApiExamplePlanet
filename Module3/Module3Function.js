const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');


function EditUserInformation(req, res, UID, data) {
  // Crear JSON para Personal_information
  const dataPersonal = {
    Nombre: data.Nombre,
    ApellidoPaterno: data.AP,
    ApellidoMaterno: data.AM,
    FechaNacimiento: data.FechaNacimiento,
    Altura: data.Altura,
    Peso: data.Peso,
    IMC: data.IMC
  };

  // Crear JSON para Users
  const dataUsuarios = {
    Email: data.Email,
    Password: data.Pass
  };

  // Realizar consulta para actualizar Personal_information
  const updatePersonalQuery = {
    text: `UPDATE "Personal_information" 
           SET "Nombre" = $1, "ApellidoPaterno" = $2, "ApellidoMaterno" = $3, "FechaNacimiento" = $4, "Altura" = $5, "Peso" = $6, "IMC" = $7 
           WHERE "UID" = $8`,
    values: [
      dataPersonal.Nombre,
      dataPersonal.ApellidoPaterno,
      dataPersonal.ApellidoMaterno,
      dataPersonal.FechaNacimiento,
      dataPersonal.Altura,
      dataPersonal.Peso,
      dataPersonal.IMC,
      UID
    ]
  };

  // Realizar consulta para actualizar Users
  const updateUsersQuery = {
    text: `UPDATE "Users" 
           SET "Email" = $1, "Password" = $2 
           WHERE "UID" = $3`,
    values: [dataUsuarios.Email, dataUsuarios.Password, UID]
  };

  connection.query(updatePersonalQuery, (error1, results1) => {
    if (error1) {
      console.error('Error al actualizar Personal_information:', error1);
      res.sendStatus(500); // Error del servidor
    } else {
      connection.query(updateUsersQuery, (error2, results2) => {
        if (error2) {
          console.error('Error al actualizar Users:', error2);
          res.sendStatus(500); // Error del servidor
        } else {
          // Verificar si las actualizaciones se realizaron correctamente
          if (results1.rowCount > 0 && results2.rowCount > 0) {
            // Ambas tablas se actualizaron correctamente
            console.log('Usuario editado');
            res.sendStatus(200); // Código 200 para indicar éxito
          } else {
            // No se encontró un usuario con el UID proporcionado en alguna de las tablas
            res.sendStatus(404); // Código 404 para indicar que no se encontró el recurso
          }
        }
      });
    }
  });
}

async function GetUserInformation(req, res, UID) {
  try {
    const query = `
      SELECT u.*, pi.*
      FROM users u
      INNER JOIN personal_information pi ON u."UID" = pi."UID"
      WHERE u."UID" = $1;
    `;
    const { rows } = await connection.query(query, [UID]);

    if (rows.length > 0) {
      console.log('Resultados de la consulta:');
      console.table(rows);
      res.status(200).json(rows);
    } else {
      console.error('No se encontraron registros con el UID proporcionado');
      res.status(404).json({ error: 'No se encontraron registros' });
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}




async function DeleteUserAccount(req, res, UID) {
  try {
    // Realizar una consulta para eliminar el registro en la tabla "users"
    const deleteUserQuery = 'DELETE FROM users WHERE "UID" = $1;';
    await connection.query(deleteUserQuery, [UID]);

    // Realizar una consulta para eliminar el registro en la tabla "personal_information"
    const deletePersonalQuery = 'DELETE FROM personal_information WHERE "UID" = $1;';
    await connection.query(deletePersonalQuery, [UID]);
    console.log('Usuario eliminado');
    // Si llegamos a este punto, la eliminación fue exitosa
    res.status(200).json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}



async function test(req, res) {
  try {
    const query = 'SELECT * FROM users';
    const { rows } = await connection.query(query);
    console.log('Resultados de la consulta:');
    console.table(rows);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
  } finally {
    // Cierra la conexión a la base de datos
    connection.end();
  }
}


  

module.exports = {
    EditUserInformation, GetUserInformation, DeleteUserAccount, test
}