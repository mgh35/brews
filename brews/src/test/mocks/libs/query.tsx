import * as query from "libs/query";

jest.mock("libs/query");
const mockedQuery = query as jest.Mocked<typeof query>;

export default mockedQuery;
