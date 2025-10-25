
export const register = async (req, res) => {
  try {
    const { email, username, name, password, profilePhoto, bio, DOB, gender } =
      req.body;
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password,
        profilePhoto,
        bio,
        DOB,
        gender
      }
    });
  } catch (error) {}
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
  } catch (error) {}
};
