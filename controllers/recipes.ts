import { Request, Response } from "express";
import { Recipe } from "../models/recipe";
import axios from "axios";
import http from "http";
import { validationResult } from "express-validator";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 3000,
  httpAgent: new http.Agent({ keepAlive: true }),
});

const _uploadImage = async (
  axiosInstance: any,
  image: BinaryData,
  imageName: string
) => {
  try {
    const res = await axiosInstance.post("images", {
      image,
      filename: imageName,
      objectname: imageName,
    });
  } catch (err) {
    console.log(err);
  }

  try {
    const res = await axiosInstance.get(
      `images?filename=${imageName}&objectname=${imageName}`,
      { proxy: false }
    );
    const image_url = res.data.split("?")[0];
    return image_url;
  } catch (err) {
    console.log(err);
    return "";
  }
};

export const addRecipe = async (req: Request, res: Response) => {
  const {
    name,
    cookTime,
    prepTime,
    ingredients,
    directions,
    cuisine,
    image,
    imageName,
  } = req.body;

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.json({ errors: result.array() });
  }

  const user_email = req.user?.google.email;
  let image_url = "";

  if (image) {
    image_url = await _uploadImage(axiosInstance, image, imageName);
  }

  const newRecipe = new Recipe({
    name,
    cookTime,
    prepTime,
    ingredients,
    directions,
    user_email,
    cuisine,
    image: image_url,
  });
  await newRecipe.save();
  res.sendStatus(201);
};

export const getRecipes = async (req: Request, res: Response) => {
  const user = req.user;
  try {
    const recipes = await Recipe.find({ user_email: user?.google.email });
    res.json(recipes);
  } catch (err) {
    res.json(err);
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  const id = req.params.id;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    res.json({ err: "Recipe does not exist" });
  }

  res.json({ recipe });
};

export const deleteRecipe = async (req: Request, res: Response) => {
  const recipeId = req.params.id;
  try {
    await Recipe.deleteOne({ _id: recipeId });
    res.sendStatus(200);
  } catch (err) {
    res.json(err);
  }
};

export const editRecipe = async (req: Request, res: Response) => {
  const {
    id,
    name,
    cookTime,
    prepTime,
    ingredients,
    directions,
    cuisine,
    image,
    imageName,
  } = req.body;

  const existingRecipe = await Recipe.findById(id);

  if (!existingRecipe) {
    res.json({ err: "recipe no longer exists" });
  } else {
    let image_url;
    if (image) {
      image_url = await _uploadImage(axiosInstance, image, imageName);
    }
    await existingRecipe?.updateOne({
      name,
      cookTime,
      prepTime,
      ingredients,
      directions,
      cuisine,
      image: image_url,
    });

    res.sendStatus(200);
  }
};
