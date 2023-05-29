import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

export default function User() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    image: null,
  });
  const { user, updateUserProfile, changePassword, deleteAccount } =
    useAuthContext(); // Agrega el método updateUserProfile del AuthContext
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.displayName,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (form.image) {
        const imageUrl = await uploadImageToCloudinary(form.image); // Sube la imagen a Cloudinary y obtén la URL

        if (imageUrl) {
          await updateUserProfile({
            // Actualiza el perfil del usuario en Firebase
            displayName: form.name,
            email: form.email,
            photoURL: imageUrl,
          });
        }
      } else {
        await updateUserProfile({
          // Actualiza el perfil del usuario en Firebase sin cambiar la imagen
          displayName: form.name,
          email: form.email,
        });
      }
      router.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChangePassword = async () => {
    const isRecentLogin = () => {
      const lastSignInTime = user.metadata.lastSignInTime;
      const now = Date.now();
      const recentTimeLimit = 5 * 60 * 1000; // 5 minutos en milisegundos
      return now - new Date(lastSignInTime).getTime() <= recentTimeLimit;
    };
    if (!isRecentLogin()) {
      alert(
        "Para eliminar tu cuenta, debes haber iniciado sesión recientemente. Por favor, vuelve a iniciar sesión y vuelve a intentarlo."
      );
      return;
    }
    try {
      if (!form.password || !form.passwordConfirmation) {
        alert("Debes completar todos los campos");
        return;
      }
      if (form.password !== form.passwordConfirmation) {
        alert("Las contraseñas no coinciden");
        return;
      }
      await changePassword(form.password);
      alert("Contraseña cambiada correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    const isRecentLogin = () => {
      const lastSignInTime = user.metadata.lastSignInTime;
      const now = Date.now();
      const recentTimeLimit = 5 * 60 * 1000; // 5 minutos en milisegundos
      return now - new Date(lastSignInTime).getTime() <= recentTimeLimit;
    };
    if (!isRecentLogin()) {
      alert(
        "Para eliminar tu cuenta, debes haber iniciado sesión recientemente. Por favor, vuelve a iniciar sesión y vuelve a intentarlo."
      );
      return;
    }
    try {
      if (confirm("¿Estás seguro de eliminar tu cuenta?")) {
        await deleteAccount();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "sistema_de_ventas");
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD);

      const response = await fetch(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="card">
        <h2>Perfil de usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div className="col">
              <label>
                Nombre completo
                <input
                  type="text"
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email
                <input
                  type="text"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Guardar</button>
            </div>
            <div className="col">
              <div className="image">
                <img
                  src={
                    form.image
                      ? URL.createObjectURL(form.image)
                      : user?.photoURL ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt=""
                />
                <input type="file" name="image" onChange={handleImageChange} />
              </div>
            </div>
          </div>
        </form>
        <div className="col">
          <h3>Cambiar contraseña</h3>
          <label>
            Nueva contraseña
            <input
              type="password"
              name="password"
              value={form.password || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Confirmar nueva contraseña
            <input
              type="password"
              name="passwordConfirmation"
              value={form.passwordConfirmation || ""}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleChangePassword}>Cambiar contraseña</button>
        </div>
        <div className="col">
          <h3>Eliminar cuenta</h3>
          <button onClick={handleDelete}>Eliminar cuenta</button>
        </div>
      </div>
    </>
  );
}
