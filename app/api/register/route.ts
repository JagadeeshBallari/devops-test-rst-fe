import fetch from "node-fetch";

export async function POST(req: any, res: any) {
    const adaptedBody = await req.json();
    console.log(adaptedBody);

    try {
        const response = await fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: adaptedBody.firstName,
                lastName: adaptedBody.lastName,
                role: adaptedBody.role,
                email: adaptedBody.email,
                password: adaptedBody.password
            }),
        });

        // Check if the response is ok before attempting to parse it
        if (!response.ok) {
            console.error("Registration failed");
            return new Response(JSON.stringify({ message: "Registration failed" }), { status: 401 });
        }

        const contentType = response.headers.get("content-type");
        let responseData;

        if (contentType && contentType.indexOf("application/json") !== -1) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        console.log("Registration response:", responseData);

        // Handle JSON response if applicable
        if (typeof responseData === "string") {
            try {
                responseData = JSON.parse(responseData);
            } catch (error) {
                // Response is not JSON, it’s plain text
                console.log("Response is plain text:", responseData);
            }
        }

        console.log("Registration successful:", responseData);
        return new Response(JSON.stringify({ message: "Registration successful" }), { status: 200 });

    } catch (error) {
        console.error("Error during registration:", error);
        return new Response(JSON.stringify({ message: "Registration failed" }), { status: 500 });
    }
}


