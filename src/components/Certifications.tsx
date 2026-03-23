import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, ExternalLink, Eye } from 'lucide-react'

const Certifications = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const certifications = [
    {
      name: "C++ Programming: OOPs and DSA - Summer Training",
      issuer: "CSE PATHSHALA",
      date: "August 2025",
      link: "#",
      image: "/src/assets/certificates/cpp-summer-training.png",
      credentialId: "CP-20250607-2CPP-201",
      skills: ["C++", "OOPs", "Data Structures", "Algorithms"],
      duration: "35+ Hours",
      period: "10th June 2025 - 28th July 2025"
    },
    {
      name: "AWS Academy Cloud Foundations",
      issuer: "Amazon Web Services",
      date: "2024",
      link: "#",
      image: "/src/assets/certificates/aws-cloud-foundations.png",
      credentialId: "AWS-CF-2024-12345",
      skills: ["Cloud Computing", "AWS Services", "Cloud Architecture"]
    },
    {
      name: "Oracle Cloud Infrastructure Foundations Associate",
      issuer: "Oracle University",
      date: "2024",
      link: "#",
      image: "/src/assets/certificates/oracle-cloud.png",
      credentialId: "OCI-2024-67890",
      skills: ["OCI", "Cloud Infrastructure", "Oracle Cloud"]
    },
    {
      name: "Advanced Computer Networks",
      issuer: "NPTEL",
      date: "2023",
      link: "#",
      image: "/src/assets/certificates/advanced-computer-networks.png",
      credentialId: "NPTEL-CN-2023-45678",
      skills: ["Network Protocols", "TCP/IP", "Network Security"]
    },
    {
      name: "SQL (Advanced)",
      issuer: "HackerRank",
      date: "2024",
      link: "#",
      image: "/src/assets/certificates/sql-advanced.png",
      credentialId: "HR-SQL-ADV-2024-98765",
      skills: ["Complex Queries", "Database Optimization", "PL/SQL"]
    },
    {
      name: "Symposium Participation",
      issuer: "LPU",
      date: "2024",
      link: "#",
      image: "/src/assets/certificates/SYMPOSIUM.png",
      credentialId: "SYM-2024-12345",
      skills: ["Technical Symposium", "Networking", "Innovation"]
    }
  ]

  return (
    <section id="certifications" className="py-20 bg-dark-surface/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-xl text-gray-400">Professional credentials & achievements</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-4"></div>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="card overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 h-full flex flex-col">
                {/* Certificate Image */}
                <div className="relative overflow-hidden h-48 bg-dark-surface">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      console.log(`Failed to load image: ${cert.image}`);
                      e.currentTarget.src = "https://placehold.co/400x300/1e2639/3b82f6?text=Certificate";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  {/* Badge Overlay */}
                  <div className="absolute top-4 right-4 bg-primary-600/90 backdrop-blur-sm rounded-full p-2">
                    <Award size={16} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gray-400">{cert.issuer}</p>
                    <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                    {cert.duration && (
                      <p className="text-xs text-primary-400 mt-1">📅 {cert.duration}</p>
                    )}
                    {cert.period && (
                      <p className="text-xs text-gray-500">{cert.period}</p>
                    )}
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Credential ID */}
                  <div className="mb-4 p-2 bg-dark-surface rounded-lg border border-dark-border">
                    <p className="text-xs text-gray-500 mb-1">Credential ID:</p>
                    <p className="text-xs font-mono text-gray-400 break-all">{cert.credentialId}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto pt-4 border-t border-dark-border">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-all group/btn"
                    >
                      <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="text-sm font-medium">View Certificate</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certificate Gallery Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Certificate Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.a
                key={index}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="relative group/cert"
              >
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-dark-border group-hover/cert:border-primary-500 transition-all bg-dark-surface">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover/cert:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x200/1e2639/3b82f6?text=Cert";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-end justify-center p-2">
                    <span className="text-xs text-center text-white bg-dark-bg/80 px-2 py-1 rounded">
                      View
                    </span>
                  </div>
                </div>
                <p className="text-xs text-center mt-2 text-gray-400 line-clamp-2">{cert.name.split(':')[0]}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Certifications