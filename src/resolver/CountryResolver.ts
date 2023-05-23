import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import Country, { CountryInput } from "../entity/Country";
import datasource from "../db";

@Resolver(Country)
export class CountryResolver {
  @Query(() => [Country])
  async country(): Promise<Country[]> {
    return await datasource.getRepository(Country).find();
  }

  @Mutation(() => Country)
  async createCountry(@Arg("data") data: Country): Promise<Country> {
    return await datasource.getRepository(Country).save(data);
  }

  @Mutation(() => Boolean)
  async deleteCountry(@Arg("code", () => Int) code: string): Promise<boolean> {
    const { affected } = await datasource.getRepository(Country).delete(code);
    if (affected === 0) throw new Error("country not found");
    return true;
  }

  @Mutation(() => Country)
  async updateCountry(
    @Arg("code", () => Int) code: string,
    @Arg("data") { name, emoji }: CountryInput
  ): Promise<Country> {
    const { affected } = await datasource
      .getRepository(Country)
      .update(code, { name });

    if (affected === 0) throw new Error("Country not found");

    return { code, name, emoji };
  }
}
