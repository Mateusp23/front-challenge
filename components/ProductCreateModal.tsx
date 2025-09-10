"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  Image,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import { toast } from "sonner";
import { createProductSchema, CreateProductForm } from "../lib/validations/product";
import { useProducts } from "../hooks/useProducts";

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCreateModal({ isOpen, onClose }: ProductCreateModalProps) {
  const { create, loading } = useProducts();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailType, setThumbnailType] = useState<'file' | 'url'>('file');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
  });

  const thumbnailValue = watch('thumbnail');

  // Função para lidar com upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validação de tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validação de tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB');
        return;
      }

      setValue('thumbnail', file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para lidar com URL
  const handleUrlChange = (url: string) => {
    setValue('thumbnail', url);
    if (url && isValidUrl(url)) {
      setThumbnailPreview(url);
    } else {
      setThumbnailPreview('');
    }
  };

  // Validar URL
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Limpar thumbnail
  const clearThumbnail = () => {
    setValue('thumbnail', '');
    setThumbnailPreview('');
  };

  // Submissão do formulário
  const onSubmit = async (data: CreateProductForm) => {
    const result = await create(data);
    
    if (result.success) {
      toast.success('Produto criado com sucesso!');
      handleClose();
    } else {
      toast.error(result.error || 'Erro ao criar produto');
    }
  };

  // Fechar modal e resetar
  const handleClose = () => {
    reset();
    setThumbnailPreview('');
    setThumbnailType('file');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Criar Novo Produto</ModalHeader>
          
          <ModalBody className="space-y-4">
            {/* Título */}
            <Input
              label="Título"
              placeholder="Digite o título do produto"
              {...register('title')}
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
              isRequired
            />

            {/* Descrição */}
            <Textarea
              label="Descrição"
              placeholder="Digite a descrição do produto"
              {...register('description')}
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              minRows={3}
              maxRows={6}
              isRequired
            />

            {/* Thumbnail */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Thumbnail <span className="text-danger">*</span>
              </label>
              
              {/* Seletor de tipo */}
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant={thumbnailType === 'file' ? 'solid' : 'flat'}
                  color={thumbnailType === 'file' ? 'primary' : 'default'}
                  startContent={<Upload size={16} />}
                  onPress={() => setThumbnailType('file')}
                  type="button"
                >
                  Upload
                </Button>
                <Button
                  size="sm"
                  variant={thumbnailType === 'url' ? 'solid' : 'flat'}
                  color={thumbnailType === 'url' ? 'primary' : 'default'}
                  startContent={<LinkIcon size={16} />}
                  onPress={() => setThumbnailType('url')}
                  type="button"
                >
                  URL
                </Button>
              </div>

              {/* Input baseado no tipo */}
              {thumbnailType === 'file' ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100
                      dark:file:bg-primary-900 dark:file:text-primary-300"
                  />
                  <p className="text-xs text-gray-500">
                    Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.
                  </p>
                </div>
              ) : (
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={typeof thumbnailValue === 'string' ? thumbnailValue : ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  startContent={<LinkIcon size={16} />}
                />
              )}

              {/* Preview da imagem */}
              {thumbnailPreview && (
                <Card>
                  <CardBody className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={thumbnailPreview}
                        alt="Preview"
                        width={60}
                        height={60}
                        className="object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Preview da imagem</p>
                        <p className="text-xs text-gray-500">
                          {thumbnailType === 'file' && thumbnailValue instanceof File
                            ? `${thumbnailValue.name} (${(thumbnailValue.size / 1024 / 1024).toFixed(2)} MB)`
                            : 'Imagem da URL'}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={clearThumbnail}
                        type="button"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Erro de validação */}
              {errors.thumbnail && (
                <p className="text-xs text-danger">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={handleClose}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              isDisabled={!thumbnailPreview}
            >
              Criar Produto
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
