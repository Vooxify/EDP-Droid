const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "login",
    description: "Login in database",
    options: [
        {
            name: "username",
            description: "Your database USERNAME",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "password",
            description: "Your database PASSWORD",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        try {
            const params = interaction.options._hoistedOptions;
            const usernameParam = params[0].value; // get username param
            const passwordParam = params[1].value; // get password param
            const formLoginData = {
                username: usernameParam,
                password: passwordParam,
            };

            const formBody = new URLSearchParams(formLoginData);

            try {
                const response = await fetch(
                    "http://localhost:3000/api/auth/login/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: formBody.toString(),
                    }
                );
                const jsonResponse = await response.json();
                if (!response.ok) {
                    return interaction.reply({
                        content: `${jsonResponse.error}`,
                        ephemeral: true,
                    });
                }
                return interaction.reply({
                    content: `Token generated succesfull copy it :tada:\n:diamonds: :loudspeaker: ATTENTION ! YOUR TOKEN IS SECRET DON'T GIVE IT ! \n\n||${jsonResponse.message}||`,
                    ephemeral: true,
                });
            } catch (error) {}
        } catch (error) {}
    },
};
