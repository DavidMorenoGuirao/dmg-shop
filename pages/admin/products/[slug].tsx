import DriveFileRenameOutline from "@mui/icons-material/DriveFileRenameOutline";
import UploadOutlined from "@mui/icons-material/UploadOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { capitalize } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";

import React, { FC, useEffect, useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";

import AdminLayout from "../../../components/layouts/AdminLayout";
import { IProduct } from "../../../interfaces";
import { dbProducts } from "../../../database";
import dmgApi from "../../../api/dmgApi";
import Product from "../../../models/Product";
import { ChangeEvent } from "react";

const validTypes = ["shirts", "pants", "hoodies", "hats"];
// const validTypes = ["camisas", "pantalones", "sudaderas", "gorras"];
const validGender = ["men", "women", "kid", "unisex"];
// const validGender = ["hombres", "mujeres", "niños", "unisex"];
const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newTagValue, setNewTagValue] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: product,
  });

  useEffect(() => {
    // watch create an observable the first time that the page is loaded
    const subscription = watch((value, { name, type }) => {
      if (name === "title") {
        const newSlug =
          value.title
            ?.trim()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
            .toLowerCase() || "";

        setValue("slug", newSlug);
      }
    });

    // I destroy the observable
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onNewTag = () => {
    const newTag = newTagValue.trim().toLowerCase();
    setNewTagValue("");
    const currentTags = getValues("tags");

    if (currentTags.includes(newTag) || newTag.length === 0) {
      return;
    }

    currentTags.push(newTag);
  };

  const onDeleteTag = (tag: string) => {
    const updatedTags = getValues("tags").filter((t) => t !== tag);

    setValue("tags", updatedTags, { shouldValidate: true });
  };

  const onChangeSize = (size: any): void => {
    const currentValue = getValues("sizes");

    // If exist this size I delete it
    if (currentValue.includes(size)) {
      return setValue(
        "sizes",
        currentValue.filter((s) => s !== size),
        { shouldValidate: true }
      );
    }

    // shouldValidate se usa para hacer q se reevalue el componente de React y se pueda observar el cambio
    setValue("sizes", [...currentValue, size], { shouldValidate: true });
  };

  const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    try {
      if (target.files) {
        for (let i = 0; i < target.files.length; i++) {
          const file = target.files[i];
          const formData = new FormData();
          formData.append("file", file);

          const { data } = await dmgApi.post<{ message: string }>(
            "/admin/upload",
            formData
          );

          setValue("images", [...getValues("images"), data.message], {
            shouldValidate: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteImage = (image: string) => {
    setValue(
      "images",
      getValues("images").filter((img) => img !== image),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (form: FormData) => {
    if (form.images.length < 2) return alert("Minimun 2 images");
    setIsSaving(true);

    try {
      const { data } = await dmgApi({
        url: "/admin/products",
        method: form._id ? "PUT" : "POST",
        data: form,
      });

      if (!form._id) {
        router.replace(`/admin/products/
				${form.slug}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title={"Producto"}
      subTitle={`Editando: ${product.title}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1, gap: 1 }}>
          <Button
            color="error"
            startIcon={<CancelOutlined />}
            sx={{ width: "150px" }}
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Titulo"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("title", {
                required: "Este campo es requerido",
                minLength: { value: 2, message: "Minimo 2 caracteres" },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Descripción"
              variant="filled"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register("description", {
                required: "Este campo es requerido",
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Stock"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("inStock", {
                required: "Este campo es requerido",
                minLength: { value: 0, message: "Minimo 0 caracteres" },
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("price", {
                required: "Este campo es requerido",
                minLength: { value: 0, message: "Minimo 0 caracteres" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup
                row
                value={getValues("type")}
                onChange={({ target }) =>
                  setValue("type", target.value, { shouldValidate: true })
                }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Genero</FormLabel>
              <RadioGroup
                row
                value={getValues("gender")}
                onChange={({ target }) =>
                  setValue("gender", target.value, { shouldValidate: true })
                }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Tamaños</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox
                      checked={getValues("sizes").includes(size) ? true : false}
                    />
                  }
                  label={size}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register("slug", {
                required: "Este campo es requerido",
                validate: (val) =>
                  val.trim().includes(" ")
                    ? "Espacios en blanco no estan permitidos"
                    : undefined,
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Tags"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para añadir"
              value={newTagValue}
              onChange={({ target }) => setNewTagValue(target.value)}
              onKeyUp={({ code }) =>
                code === "Space" ? onNewTag() : undefined
              }
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {getValues("tags").map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imagenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Carga imagen
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
                onChange={onFileSelected}
              />

              <Chip
                label="Se requiere de al menos 2 imagenes"
                color="error"
                variant="outlined"
                sx={{
                  display: getValues("images").length < 2 ? "flex" : "none",
                }}
              />

              <Grid container spacing={2}>
                {getValues("images").map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component="img"
                        className="fadeIn"
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          fullWidth
                          color="error"
                          onClick={() => {
                            onDeleteImage(img);
                          }}
                        >
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = "" } = query;

  let product: IProduct | null;

  if (slug === "new") {
    const tempProduct = JSON.parse(JSON.stringify(new Product()));

    delete tempProduct._id;
    // tempProduct.images = ["img1.jpg", "img2.jpg"];
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: "/admin/products",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
