"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  Card,
  CardBody,
  Image,
  Divider,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Link as LinkIcon, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { updateProductSchema, UpdateProductForm } from "../lib/validations/product";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/product";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductEditModal({ isOpen, onClose, product }: ProductEditModalProps) {
  const { update, updateThumbnail, loading } = useProducts();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailType, setThumbnailType] = useState<'file' | 'url'>('file');
  const [newThumbnail, setNewThumbnail] = useState<File | string | null>(null);
  const [showThumbnailSection, setShowThumbnailSection] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateProductForm>({
    resolver: zodResolver(updateProductSchema),
  });

  // Preencher formulário quando produto mudar
  useEffect(() => {
    if (product) {
      setValue('title', product.title);
      setValue('description', product.description);
      setValue('status', product.status);
      setThumbnailPreview(product.thumbnail || '');
      setNewThumbnail(null);
      setShowThumbnailSection(false);
    }
  }, [product, setValue]);

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

      setNewThumbnail(file);
      
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
    setNewThumbnail(url);
    if (url && isValidUrl(url)) {
      setThumbnailPreview(url);
    } else {
      setThumbnailPreview(product?.thumbnail || '');
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

  // Cancelar alteração de thumbnail
  const cancelThumbnailChange = () => {
    setNewThumbnail(null);
    setThumbnailPreview(product?.thumbnail || '');
    setShowThumbnailSection(false);
  };

  // Submissão do formulário
  const onSubmit = async (data: UpdateProductForm) => {
    if (!product) return;

    try {
      // 1. Atualizar dados básicos do produto
      const updateResult = await update(product.id, data);
      
      if (!updateResult.success) {
        toast.error(updateResult.error || 'Erro ao atualizar produto');
        return;
      }

      // 2. Atualizar thumbnail se foi alterada
      if (newThumbnail) {
        const thumbnailResult = await updateThumbnail(product.id, newThumbnail);
        
        if (!thumbnailResult.success) {
          toast.error(thumbnailResult.error || 'Erro ao atualizar imagem');
          return;
        }
      }

      toast.success('Produto atualizado com sucesso!');
      handleClose();
    } catch {
      toast.error('Erro inesperado ao atualizar produto');
    }
  };

  // Fechar modal e resetar
  const handleClose = () => {
    reset();
    setThumbnailPreview('');
    setNewThumbnail(null);
    setShowThumbnailSection(false);
    setThumbnailType('file');
    onClose();
  };

  if (!product) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Editar Produto</ModalHeader>
          
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

            {/* Status */}
            <div className="flex items-center gap-2">
              <Switch
                {...register('status')}
                defaultSelected={product.status}
                color="success"
              />
              <span className="text-sm">Produto ativo</span>
            </div>

            <Divider />

            {/* Seção de Thumbnail */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Thumbnail Atual</label>
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<ImageIcon size={16} />}
                  onPress={() => setShowThumbnailSection(!showThumbnailSection)}
                  type="button"
                >
                  {showThumbnailSection ? 'Cancelar' : 'Alterar Imagem'}
                </Button>
              </div>

              {/* Thumbnail atual */}
              <Card>
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={thumbnailPreview || product.thumbnail}
                      alt={product.title}
                      width={60}
                      height={60}
                      className="object-cover rounded-md"
                      fallbackSrc="/placeholder-image.png"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {newThumbnail ? 'Nova imagem selecionada' : 'Imagem atual'}
                      </p>
                      {newThumbnail && (
                        <p className="text-xs text-primary">
                          A imagem será atualizada ao salvar
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Seção para alterar thumbnail */}
              {showThumbnailSection && (
                <Card>
                  <CardBody className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Nova Thumbnail</span>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={cancelThumbnailChange}
                        type="button"
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    {/* Seletor de tipo */}
                    <div className="flex gap-2">
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
                        onChange={(e) => handleUrlChange(e.target.value)}
                        startContent={<LinkIcon size={16} />}
                      />
                    )}
                  </CardBody>
                </Card>
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
            >
              Salvar Alterações
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
