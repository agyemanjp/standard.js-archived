/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import { TypeAssert } from "../utility"

import { DecrementNonZero, DigitNonZero } from "../numeric"
import { Obj } from "../utility"

export type UppercaseChar = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
export type LowercaseChar = Lowercase<UppercaseChar>
export type AlphabeticChar = UppercaseChar | LowercaseChar

export type UppercaseVowel = "A" | "E" | "I" | "O" | "U"
export type LowercaseVowel = Lowercase<UppercaseVowel>

export type UppercaseConsonant = | "B" | "C" | "D" | "F" | "G" | "H" | "J" | "K" | "L" | "M" | "N" | "P" | "Q" | "R" | "S" | "T" | "V" | "W" | "X" | "Y" | "Z"
export type LowercaseConsonant = Lowercase<UppercaseConsonant>

export type Concat<A extends string, B extends string> = `${A}${B}`
const test_concat: TypeAssert<Concat<"auth.com/:cat/api", "/:app/verify">, "auth.com/:cat/api/:app/verify"> = "true"

export type Repeat<Str extends string | number, Count extends DigitNonZero, Sep extends string = " "> = Count extends 1
	? Str
	: `${Str}${Sep}${Repeat<Str, DecrementNonZero<Count>, Sep>}`
const test_Repeat: TypeAssert<Repeat<"abc", 4, "_">, "abc_abc_abc_abc"> = "true"

export type UnionOfRepeats<Str extends string, Max extends DigitNonZero, Sep extends string = " "> = Max extends 1
	? Str
	: Str | `${Str}${Sep}${UnionOfRepeats<Str, DecrementNonZero<Max>, Sep>}`
const test_UnionOfRepeats: TypeAssert<UnionOfRepeats<"abc", 3, ",">, "abc" | "abc,abc" | "abc,abc,abc"> = "true"

export type HeadOf<S extends string> = S extends `${infer head}${infer tail}` ? head : S

export type CaseOf<S extends string> = (
	Lowercase<S> extends Uppercase<S>
	? "none"
	: Uppercase<S> extends S
	? "upper"
	: "lower"
)

export type CamelCase<S extends string, PrevCase extends "upper" | "lower" | "none" = "upper"> = (
	S extends `${infer head}${infer tail}`
	? head extends " " | "_" | "-" | "."
	? `${CamelCase<tail, "none">}`
	: head extends UppercaseChar
	? PrevCase extends "lower"
	? `${head}${CamelCase<tail, CaseOf<head>>}`
	: PrevCase extends "upper"
	? `${Lowercase<head>}${CamelCase<tail, CaseOf<head>>}`
	: `${Uppercase<head>}${CamelCase<tail, "upper">}` // PrevCase extends "separator"
	: `${head}${CamelCase<tail, "lower">}` // head extends LowercaseChar
	: S
)
export type KeysToCamelCase<T> = {
	[K in keyof T as CamelCase<string & K>]: T[K] extends Obj ? KeysToCamelCase<T[K]> : T[K]
}
const test_KeysToCamelCase: TypeAssert<
	KeysToCamelCase<{
		s3CloudfrontURL: string;
		DEV_EMAIL_ADDRESSES: string;
		"DATABASE-URL": string;
		APP_NAME: string;
		NODE_ENV: number;
		isGood: unknown[]
	}>,
	{
		s3CloudfrontUrl: string;
		devEmailAddresses: string;
		databaseUrl: string;
		appName: string;
		nodeEnv: number;
		isGood: unknown[];
	}
> = "true"

export type DashCase<S extends string, PrevCase extends "upper" | "lower" = "upper"> = (S extends `${infer head}${infer tail}`
	? head extends " " | "_" | "-" | "."
	? `-${DashCase<tail, "upper">}`
	: head extends UppercaseChar
	? PrevCase extends "lower"
	? `-${Lowercase<head>}${DashCase<tail, "upper">}`
	: `${Lowercase<head>}${DashCase<tail, "upper">}`
	: `${head}${DashCase<tail, "lower">}` // head extends LowercaseChar
	: S
)
export type KeysToDashCase<T> = {
	[K in keyof T as DashCase<string & K>]: T[K] extends Obj ? KeysToDashCase<T[K]> : T[K]
}
const test_KeysToDashCase: TypeAssert<
	KeysToDashCase<{
		s3CloudfrontURL: string;
		DEV_EMAIL_ADDRESSES: string;
		APP_NAME: string;
		"NODE-ENV": number;
		areGood: unknown[]
	}>,
	{
		"s3-cloudfront-url": string;
		"dev-email-addresses": string;
		"app-name": string;
		"node-env": number;
		"are-good": unknown[];
	}
> = "true"

export type SnakeCase<S extends string, PrevCase extends "upper" | "lower" = "upper"> = (
	S extends `${infer head}${infer tail}`
	? head extends " " | "-" | "_" | "."
	? `_${SnakeCase<tail, "upper">}`
	: head extends UppercaseChar
	? PrevCase extends "lower"
	? `_${Lowercase<head>}${SnakeCase<tail, "upper">}`
	: `${Lowercase<head>}${SnakeCase<tail, "upper">}`
	: `${head}${SnakeCase<tail, "lower">}` // head extends LowercaseChar
	: S
)
export type KeysToSnakeCase<T> = {
	[K in keyof T as SnakeCase<string & K>]: T[K] extends Obj ? KeysToSnakeCase<T[K]> : T[K]
}
const test_KeysToSnakeCase: TypeAssert<
	KeysToSnakeCase<{
		s3CloudfrontURL: string;
		DEV_EMAIL_ADDRESSES: string;
		"DATABASE-URL": string;
		APP_NAME: string;
		isGood: unknown[]
	}>,
	{
		s3_cloudfront_url: string;
		dev_email_addresses: string;
		database_url: string;
		app_name: string;
		is_good: unknown[];
	}
> = "true"

export type InitCapCase<S extends string> = (S extends `${infer head}${infer tail}`
	? `${Uppercase<head>}${Lowercase<tail>}`
	: S
)
export type KeysToInitCapCase<T> = {
	[K in keyof T as InitCapCase<string & K>]: T[K] extends Obj ? KeysToInitCapCase<T[K]> : T[K]
}
const test_KeysToInitCapCase: TypeAssert<
	KeysToInitCapCase<{
		cloudfrontURL: string;
		EMAIL_ADDRESSES: string;
		"DATABASE-URL": string;
		APP_NAME: string;
		IsGood: unknown[]
	}>,
	{
		Cloudfronturl: string;
		Email_addresses: string;
		"Database-url": string;
		App_name: string;
		Isgood: unknown[];
	}
> = "true"


type X = KeysToSnakeCase<{
	s3CloudfrontURL: string;
	DEV_EMAIL_ADDRESSES: string;
	"DATABASE-URL": string;
	APP_NAME: string;
	isGood: unknown[]
}>