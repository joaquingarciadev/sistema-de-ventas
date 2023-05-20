import { useAuthContext } from "@/contexts/AuthContext";

export default function User() {
  const { user } = useAuthContext();

  return (
    <>
      <div className="card">
        <form>
          <div className="grid">
            <div className="col">
              <div className="row">
                <label>
                  Nombre
                  <input type="text" name="name" />
                </label>
                <label>
                  Apellido
                  <input type="text" name="lastname" />
                </label>
              </div>
              <label>
                Email
                <input type="text" name="email" />
              </label>
              <label>
                Contraseña
                <input type="text" name="password" />
              </label>
              <button type="submit">Guardar</button>
            </div>
            <div className="col">
              <div className="image">
                <img
                  src={
                    user?.photoURL ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt=""
                />
                <input type="file" name="image" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
