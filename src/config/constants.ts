// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const PORT: number = parseInt(process.env.PORT!, 10);
export default PORT;
