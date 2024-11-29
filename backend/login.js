const handleLogin = async (event) => {
    event.preventDefault(); // Previene el envío tradicional del formulario.

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: email, password: password }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.redirect) {
                window.location.href = data.redirect; // Redirección al dashboard
            } else {
                alert("Error: No se recibió una redirección.");
            }
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Error en el login");
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        alert("No se pudo conectar con el servidor");
    }
};
