import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import React, { useState } from 'react'
import { getCompanyDetails } from '@/actions/company-actions'
import { Building2, Calendar, Check, Clock, Copy, Hash, Key, Mail, MapPin, Phone, User, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface CompanyData {
  id: string
  name: string
  address: string
  phone: string
  employeesCount: number
  rrhh: string
  rrhhJoinCode: {
    code: string
    expiresAt: string
    usesLeft: number
  }
}

interface CompanyAlertDialogProps {
  trigger?: React.ReactNode
  companyId: string
}

function isCodeExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

export function CompanyDetails({ trigger, companyId }: CompanyAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [companyDetails, setCompanyDetails] = useState<CompanyData | null>(null)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (open && companyId) {
      getCompanyDetails(companyId)
        .then(data => {
          setCompanyDetails(data)
        })
        .catch(error => {
          console.error('Error fetching company details:', error)
        })
    }
  }

  const handleCopyCode = async () => {
    if (companyDetails?.rrhhJoinCode.code) {
      try {
        await navigator.clipboard.writeText(companyDetails.rrhhJoinCode.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Error al copiar:", err)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <button className="text-blue-500 hover:text-blue-700">Ver detalles</button>}
      </DialogTrigger>
      <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {/*{isLoading ? "Cargando..." : company?.name || "Detalles de la empresa"}*/}
            {companyDetails?.name}
          </DialogTitle>
          <DialogDescription>
            {/*{isLoading ? "Obteniendo información de la empresa..." : "Aquí puedes ver todos los detalles de la empresa"}*/}
            Aquí puedes ver todos los detalles de la empresa
          </DialogDescription>
        </DialogHeader>

        {/*{isLoading && (*/}
        {/*  <div className="flex items-center justify-center py-8">*/}
        {/*    <Loader2 className="h-8 w-8 animate-spin" />*/}
        {/*    <span className="ml-2">Cargando datos de la empresa...</span>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/*{error && (*/}
        {/*  <div className="text-red-500 text-center py-8">*/}
        {/*    Error al cargar los datos de la empresa. Por favor, intenta nuevamente.*/}
        {/*  </div>*/}
        {/*)}*/}

        {companyDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 min-h-[400px]">
            {/* Columna Izquierda - Información Básica */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Información General
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-base mt-1 font-medium">{companyDetails.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Empleados</label>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {companyDetails.employeesCount} {companyDetails.employeesCount === 1 ? "empleado" : "empleados"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">RR.HH</label>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {companyDetails.rrhh}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Información de Contacto
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección</label>
                    <p className="text-sm mt-1 flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {companyDetails.address}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono</label>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${companyDetails.phone}`} className="text-blue-600 hover:text-blue-800">
                        {companyDetails.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Código RRHH */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-600" />
                    Código de RRHH
                  </h3>
                  {/*<Button*/}
                  {/*  onClick={handleRegenerateCode}*/}
                  {/*  disabled={regenerateCodeMutation.isPending}*/}
                  {/*  size="sm"*/}
                  {/*  variant="outline"*/}
                  {/*  className="text-blue-600 border-blue-300 hover:bg-blue-100"*/}
                  {/*>*/}
                  {/*  {regenerateCodeMutation.isPending ? (*/}
                  {/*    <Loader2 className="h-4 w-4 animate-spin mr-1" />*/}
                  {/*  ) : (*/}
                  {/*    <RefreshCw className="h-4 w-4 mr-1" />*/}
                  {/*  )}*/}
                  {/*  Regenerar*/}
                  {/*</Button>*/}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Código de Acceso</label>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="text-lg font-mono bg-white px-3 py-2 rounded border border-blue-300 text-blue-800 font-bold flex-1">
                        {companyDetails.rrhhJoinCode.code}
                      </code>
                      <Button
                        onClick={handleCopyCode}
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-300 hover:bg-blue-100"
                        title="Copiar código"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    {copied && <p className="text-xs text-green-600 mt-1">¡Código copiado al portapapeles!</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado del Código</label>
                    <div className="mt-1">
                      {isCodeExpired(companyDetails.rrhhJoinCode.expiresAt) ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <Clock className="h-3 w-3" />
                          Expirado
                        </Badge>
                      ) : (
                        <Badge variant="default" className="flex items-center gap-1 w-fit bg-green-600">
                          <Clock className="h-3 w-3" />
                          Activo
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Expiración</label>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(companyDetails.rrhhJoinCode.expiresAt)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Usos Restantes</label>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      {companyDetails.rrhhJoinCode.usesLeft === 0 ? (
                        <span className="text-red-600 font-medium">Sin usos disponibles</span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          {companyDetails.rrhhJoinCode.usesLeft} {companyDetails.rrhhJoinCode.usesLeft === 1 ? "uso" : "usos"}{" "}
                          restante{companyDetails.rrhhJoinCode.usesLeft === 1 ? "" : "s"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/*{regenerateCodeMutation.isPending && (*/}
                {/*  <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-300">*/}
                {/*    <p className="text-sm text-blue-700 flex items-center gap-2">*/}
                {/*      <Loader2 className="h-4 w-4 animate-spin" />*/}
                {/*      Generando nuevo código...*/}
                {/*    </p>*/}
                {/*  </div>*/}
                {/*)}*/}

                {/*{regenerateCodeMutation.isSuccess && (*/}
                {/*  <div className="mt-4 p-3 bg-green-100 rounded border border-green-300">*/}
                {/*    <p className="text-sm text-green-700">✅ Código regenerado exitosamente</p>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>

              {/* Información adicional sobre el código */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-sm text-yellow-800 mb-2">ℹ️ Información del Código</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Este código permite a los empleados unirse al sistema de RRHH</li>
                  <li>• El código expira automáticamente en la fecha indicada</li>
                  <li>• Una vez agotados los usos, será necesario generar un nuevo código</li>
                  <li>• Puedes regenerar el código en cualquier momento usando el botón "Regenerar"</li>
                  {isCodeExpired(companyDetails.rrhhJoinCode.expiresAt) && (
                    <li className="text-red-600 font-medium">• ⚠️ Este código ha expirado y no puede ser utilizado</li>
                  )}
                  {companyDetails.rrhhJoinCode.usesLeft === 0 && !isCodeExpired(companyDetails.rrhhJoinCode.expiresAt) && (
                    <li className="text-red-600 font-medium">• ⚠️ Este código no tiene usos restantes</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}